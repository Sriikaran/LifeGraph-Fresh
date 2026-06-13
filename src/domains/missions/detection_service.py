import json
import logging
import re
from typing import Dict, Any, List, Tuple


from infrastructure.bedrock.client import BedrockClient
from shared.repositories.mission_repository import MissionRepository
from graph.service import GraphService

logger = logging.getLogger(__name__)

# Global cache to store pre-computed mission embeddings to avoid heavy runtime Bedrock billing/latency
_MISSION_EMBEDDINGS_CACHE: Dict[str, List[float]] = {}

class DetectionService:
    def __init__(self):
        self.bedrock_client = BedrockClient()
        self.mission_repository = MissionRepository()
        self.graph_service = GraphService()

    def _get_cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """Calculates dot product of two normalized vectors (cosine similarity)."""
        if not vec1 or not vec2 or len(vec1) != len(vec2):
            return 0.0
        dot_product = sum(x * y for x, y in zip(vec1, vec2))
        return dot_product

    def _get_or_create_mission_embedding(self, mission: Any) -> List[float]:
        """Gets cached embedding for a mission or generates a new one."""
        mission_id = mission.mission_id
        if mission_id in _MISSION_EMBEDDINGS_CACHE:
            return _MISSION_EMBEDDINGS_CACHE[mission_id]

        # Combine fields into a rich text representative of the mission
        keywords_str = " ".join(mission.keywords)
        synonyms_str = " ".join(mission.synonyms)
        examples_str = " ".join(mission.intent_examples)
        combined_text = f"{mission.name}. {mission.description}. Keywords: {keywords_str}. Synonyms: {synonyms_str}. Examples: {examples_str}"
        
        try:
            embedding = self.bedrock_client.generate_embeddings(combined_text)
            _MISSION_EMBEDDINGS_CACHE[mission_id] = embedding
            return embedding
        except Exception as e:
            logger.error(f"Error generating embedding for mission {mission_id}: {e}")
            return [0.0] * 1536

    def detect_mission(self, query: str) -> Dict[str, Any]:
        """
        Executes the 5-step Semantic Mission Detection Pipeline:
        1. Bedrock Intent Understanding
        2. Generate query embedding
        3. Semantic Retrieval (Top 10 closest)
        4. Re-Ranking (Claude choice)
        5. Graph Validation
        """
        logger.info(f"Detecting mission for query: '{query}'")

        # Step 1: Bedrock Intent Understanding
        intent_prompt = f"""You are an expert intent extractor for Indian e-commerce.
Analyze the user's shopping intent query: "{query}"

Extract the following details as a JSON object:
- goal: The customer's primary shopping objective (e.g. birthday celebration, diwali prep, weekly grocery).
- event_type: Category of the intent (e.g. festival, event, cooking, grocery, travel, health, student, spiritual).
- guest_count: Estimated number of guests, participants, or people involved (integer, default to 1 if unspecified).
- audience: Primary target audience if specified (e.g. children, adults, family, bachelors).

Return ONLY the valid JSON object, no other explanation or wrapper tags.
"""
        try:
            intent_res = self.bedrock_client.invoke_model(intent_prompt)
            intent_data = json.loads(intent_res.content)
        except Exception as e:
            logger.error(f"Step 1 (Intent Understanding) failed: {e}")
            intent_data = {"goal": "general shopping", "guest_count": 1, "event_type": "grocery", "audience": "family"}

        # Extract parameters for Phase 5
        parameters = {
            "guest_count": intent_data.get("guest_count", 1),
            "audience": intent_data.get("audience", "family")
        }

        # Step 2: Generate embedding for User Query
        query_embedding = self.bedrock_client.generate_embeddings(query)

        # Step 3: Semantic Retrieval (Retrieve Top 10 closest missions)
        all_missions = self.mission_repository.list_missions()
        if not all_missions:
            # Re-seed default or return empty
            return {
                "success": False,
                "error": "No missions found in library. Run seeder first."
            }

        candidates_with_score: List[Tuple[Any, float]] = []
        query_words = set(re.findall(r'\w+', query.lower()))
        
        for mission in all_missions:
            mission_embedding = self._get_or_create_mission_embedding(mission)
            score = self._get_cosine_similarity(query_embedding, mission_embedding)
            
            # Hybrid search lexical boost: boost candidates that share exact name/keyword tokens with the query
            boost = 0.0
            name_words = set(re.findall(r'\w+', mission.name.lower()))
            id_words = set(mission.mission_id.lower().split('_'))
            
            # Name & ID overlap
            overlap = query_words.intersection(name_words.union(id_words))
            boost += len(overlap) * 2.0
            
            # Keywords and synonyms overlap
            for kw in mission.keywords:
                if kw.lower() in query_words:
                    boost += 1.0
            for syn in mission.synonyms:
                syn_words = set(re.findall(r'\w+', syn.lower()))
                if syn_words.issubset(query_words):
                    boost += 1.5
                    
            candidates_with_score.append((mission, score + boost))

        # Sort candidates descending by similarity score
        candidates_with_score.sort(key=lambda x: x[1], reverse=True)
        top_candidates = candidates_with_score[:10]

        # Step 4: Mission Re-Ranking using Claude
        candidate_list_str = "\n".join([
            f"- mission_id: \"{m.mission_id}\", name: \"{m.name}\", description: \"{m.description}\""
            for m, _ in top_candidates
        ])

        rerank_prompt = f"""You are a smart catalog selector. We need to match a user query to the most appropriate pre-defined mission catalog.

User Query: "{query}"
Extracted Goal: "{intent_data.get('goal')}"

Candidate Missions:
{candidate_list_str}

Choose the single best match from the Candidate list above.
Return a JSON object containing:
- mission_id: The exact mission_id of the chosen candidate.
- confidence: A confidence score between 0.0 and 1.0.
- reason: A concise explanation of why this mission matches the query.

Return ONLY the raw JSON object, no Markdown boxes, code blocks, or extra text.
"""
        try:
            rerank_res = self.bedrock_client.invoke_model(rerank_prompt)
            # Strip markdown block wrappers if LLM returned them
            clean_content = rerank_res.content.strip()
            if clean_content.startswith("```"):
                lines = clean_content.split("\n")
                if lines[0].startswith("```json") or lines[0].startswith("```"):
                    clean_content = "\n".join(lines[1:-1]).strip()
            rerank_data = json.loads(clean_content)
        except Exception as e:
            logger.error(f"Step 4 (Re-Ranking) failed: {e}")
            # Fallback to the top candidate from cosine similarity
            best_cand = top_candidates[0][0]
            rerank_data = {
                "mission_id": best_cand.mission_id,
                "confidence": 0.85,
                "reason": "Fallback to similarity match due to re-ranking error."
            }

        selected_id = rerank_data.get("mission_id")
        
        # Step 5: Graph Validation
        # Check if the mission exists in database
        db_mission = self.mission_repository.get_mission(selected_id)
        if not db_mission:
            # Fallback to first available candidate in top_candidates that is in database
            db_mission = None
            for cand, _ in top_candidates:
                exists = self.mission_repository.get_mission(cand.mission_id)
                if exists:
                    db_mission = exists
                    selected_id = exists.mission_id
                    break

        if not db_mission:
            # Fallback to the first mission in the database
            db_mission = all_missions[0]
            selected_id = db_mission.mission_id

        # Verify requirements/products from Graph Service
        requirements = self.graph_service.get_mission_requirements(selected_id)
        is_complete = len(requirements) > 0

        return {
            "success": True,
            "mission_id": selected_id,
            "confidence": rerank_data.get("confidence", 0.95),
            "reason": rerank_data.get("reason", ""),
            "parameters": parameters,
            "validation": {
                "exists": True,
                "graph_complete": is_complete,
                "required_products_count": len(requirements)
            }
        }
