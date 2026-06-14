import re
from typing import Dict, List, Tuple
from .schemas import MissionDetectionRequest, MissionDetectionResponse
from shared.repositories.mission_repository import MissionRepository

class MissionDetectionService:
    def __init__(self):
        self.mission_repo = MissionRepository()
        self._valid_missions = None
        
        self.rules = {
            "CHICKEN_BIRYANI": ["biryani", "chicken biryani", "cook biryani"],
            "PASTA_DINNER": ["pasta", "spaghetti", "macaroni", "italian dinner"],
            "BREAKFAST": ["breakfast", "morning meal", "eggs and toast", "pancakes"],
            "WEEKLY_GROCERIES": ["groceries", "grocery shopping", "weekly shopping", "stock up"],
            "HOUSE_PARTY": ["house party", "hosting a party", "gathering", "drinks tonight", "party at my place"],
            "MOVIE_NIGHT": ["movie night", "watching a movie", "cinema", "film night", "netflix"],
            "ROAD_TRIP": ["road trip", "long drive", "highway", "driving to", "weekend trip"],
            "CAMPING_TRIP": ["camping", "tent", "hiking", "bonfire", "outdoors weekend"],
            "SICK_DAY_RECOVERY": ["sick", "unwell", "fever", "cold", "recovery", "medicine"],
            "BABY_CARE": ["baby", "infant", "diapers", "toddler", "newborn"],
            "PET_CARE": ["pet", "dog", "cat", "dog food", "cat food", "puppy", "kitten"],
            "WORK_FROM_HOME": ["wfh", "work from home", "home office", "zoom calls", "working remotely"],
            "GYM_JOURNEY": ["gym", "workout", "fitness", "protein", "training", "exercise"],
            "HOUSEWARMING": ["housewarming", "new home", "new apartment", "moving in", "just moved"],
            "BIRTHDAY_PARTY": ["birthday", "bday", "friend turns", "birthday celebration"]
        }
        
        # Lazy loading of sentence-transformers
        self._model = None
        self._corpus_embeddings = None
        self._corpus_missions = []
        
        self.semantic_examples = {
            "CHICKEN_BIRYANI": [
                "i want to cook biryani tonight",
                "making a special chicken rice dish",
                "craving some spicy indian rice",
                "need ingredients for chicken biryani",
                "cooking biryani for dinner",
                "preparing a traditional biryani meal",
                "getting ready to make biryani",
                "family wants chicken biryani",
                "hosting a biryani feast",
                "buying stuff to cook biryani"
            ],
            "PASTA_DINNER": [
                "making pasta for dinner",
                "need spaghetti and tomato sauce",
                "cooking an italian meal tonight",
                "preparing a pasta dish for the family",
                "craving some cheesy pasta",
                "getting ingredients for fettuccine alfredo",
                "want to make macaroni and cheese",
                "planning a pasta night",
                "making homemade ravioli",
                "cooking penne pasta tonight"
            ],
            "BREAKFAST": [
                "making breakfast for everyone",
                "need eggs and bacon for the morning",
                "getting morning groceries",
                "preparing a hearty breakfast",
                "want to make pancakes and syrup",
                "need cereal and milk",
                "breakfast time",
                "cooking a morning meal",
                "getting stuff for toast and jam",
                "morning coffee and breakfast"
            ],
            "WEEKLY_GROCERIES": [
                "i need groceries for the week",
                "doing my weekly grocery shopping",
                "restocking the fridge",
                "getting the weekly essentials",
                "need to buy vegetables and fruits for the week",
                "stocking up the pantry",
                "grocery run for the household",
                "buying the weekly supplies",
                "need to get my weekly groceries",
                "filling up the grocery cart"
            ],
            "HOUSE_PARTY": [
                "i'm hosting a house party tonight",
                "having friends over for drinks",
                "getting snacks for the gathering",
                "throwing a party at my place",
                "need party supplies",
                "hosting a weekend bash",
                "friends are coming over tonight",
                "preparing for a house party",
                "getting ready for tonight's party",
                "buying drinks and chips for the party"
            ],
            "MOVIE_NIGHT": [
                "movie night with friends",
                "watching a film tonight",
                "getting popcorn for the movie",
                "planning a netflix marathon",
                "movie marathon snacks",
                "renting a movie and relaxing",
                "need snacks for watching movies",
                "getting ready for cinema at home",
                "film night preparations",
                "snuggling up for a movie"
            ],
            "ROAD_TRIP": [
                "going on a long road trip",
                "driving across the country",
                "need snacks for the car journey",
                "preparing for a weekend drive",
                "hitting the highway",
                "getting ready for a road trip",
                "buying road trip essentials",
                "long drive ahead",
                "packing for a road trip",
                "traveling by car this weekend"
            ],
            "CAMPING_TRIP": [
                "going camping this weekend",
                "sleeping in a tent outdoors",
                "need gear for the camping trip",
                "preparing for a weekend in the woods",
                "hiking and camping supplies",
                "getting ready to camp",
                "buying stuff for a campfire",
                "wilderness weekend trip",
                "packing for a camping adventure",
                "heading out to the campsite"
            ],
            "SICK_DAY_RECOVERY": [
                "feeling unwell and need medicine",
                "caught a cold",
                "recovering from a fever",
                "need soup and tissues for a sick day",
                "staying in bed sick",
                "getting remedies for a sore throat",
                "sick day essentials",
                "feeling under the weather",
                "nursing a bad cold",
                "need sick day supplies"
            ],
            "BABY_CARE": [
                "need diapers and wipes",
                "buying baby food",
                "taking care of the newborn",
                "getting infant supplies",
                "need formula for the baby",
                "restocking baby essentials",
                "shopping for my toddler",
                "baby care products",
                "getting things for the nursery",
                "preparing for the baby's needs"
            ],
            "PET_CARE": [
                "buying food for my dog",
                "need cat litter and treats",
                "taking care of my pet",
                "getting supplies for the puppy",
                "restocking pet food",
                "shopping for my furry friend",
                "need dog shampoo and toys",
                "pet care essentials",
                "getting things for the kitten",
                "buying pet supplies"
            ],
            "WORK_FROM_HOME": [
                "setting up my home office",
                "need coffee for working from home",
                "getting snacks for the workday",
                "wfh essentials",
                "working remotely today",
                "preparing for a day of zoom calls",
                "stocking up for home office",
                "need supplies for my desk",
                "working from my apartment",
                "getting through the remote workday"
            ],
            "GYM_JOURNEY": [
                "heading to the gym",
                "need protein powder for workouts",
                "getting ready for a fitness session",
                "buying healthy snacks for training",
                "post-workout recovery",
                "starting my fitness journey",
                "need energy drinks for the gym",
                "preparing for weightlifting",
                "getting gym supplements",
                "focusing on muscle building"
            ],
            "HOUSEWARMING": [
                "attending a housewarming party",
                "buying a gift for a new home",
                "friends just moved into a new place",
                "celebrating a new apartment",
                "need a housewarming present",
                "going to a new house celebration",
                "getting something for their new home",
                "they just bought a house",
                "moving in celebration",
                "welcome to the new home"
            ],
            "BIRTHDAY_PARTY": [
                "my friend turns 20 tomorrow",
                "going to a birthday celebration",
                "need a cake for the birthday party",
                "getting birthday decorations",
                "buying a gift for a birthday",
                "celebrating someone getting older",
                "planning a surprise birthday party",
                "getting ready for a bday bash",
                "need candles and balloons",
                "attending a birthday event"
            ]
        }

    def _get_valid_missions(self):
        if self._valid_missions is None:
            missions = self.mission_repo.list_missions()
            self._valid_missions = set([m.mission_id for m in missions])
        return self._valid_missions

    def _get_model(self):
        if self._model is None:
            from sentence_transformers import SentenceTransformer
            self._model = SentenceTransformer('all-MiniLM-L6-v2')
            
            valid_missions = self._get_valid_missions()
            
            sentences = []
            for mission, examples in self.semantic_examples.items():
                if mission in valid_missions:
                    for ex in examples:
                        sentences.append(ex)
                        self._corpus_missions.append(mission)
            self._corpus_embeddings = self._model.encode(sentences, convert_to_tensor=True)
        return self._model

    def detect(self, request: MissionDetectionRequest) -> MissionDetectionResponse:
        text = request.text.lower()
        valid_missions = self._get_valid_missions()
        
        best_mission = "UNKNOWN"
        best_confidence = 0.0
        best_matches = []
        
        for mission, keywords in self.rules.items():
            if mission not in valid_missions:
                continue
                
            matches = []
            for kw in keywords:
                pattern = kw
                if "turns" in kw: # basic regex handling
                    match = re.search(r"turns\s+\d+", text)
                    if match:
                        matches.append(match.group(0))
                else:
                    if kw in text:
                        matches.append(kw)
            
            if matches:
                if len(matches) == 1:
                    confidence = 0.60
                elif len(matches) == 2:
                    confidence = 0.85
                else:
                    confidence = 0.94
                
                if confidence > best_confidence:
                    best_confidence = confidence
                    best_mission = mission
                    best_matches = matches
                    
        if best_confidence >= 0.85:
            return MissionDetectionResponse(
                detected_mission=best_mission,
                confidence=best_confidence,
                matched_keywords=best_matches
            )
        # Ambiguity detection
        ambiguous_phrases = ["i am hungry", "need help", "feeling low", "need something", "going out", "what should i buy", "feeling low today", "i need to eat", "need food", "want a gift", "relaxing"]
        if any(text == p for p in ambiguous_phrases) or (any(p in text for p in ambiguous_phrases) and best_confidence == 0):
            return MissionDetectionResponse(
                detected_mission="UNKNOWN",
                confidence=0.0,
                matched_keywords=[],
                suggested_missions=["BREAKFAST", "CHICKEN_BIRYANI", "PASTA_DINNER"]
            )

        model = self._get_model()
        from sentence_transformers import util
        import torch
        
        query_embedding = model.encode(text, convert_to_tensor=True)
        cos_scores = util.cos_sim(query_embedding, self._corpus_embeddings)[0]
        
        # Get top 3
        top_results = torch.topk(cos_scores, k=min(3, len(cos_scores)))
        top_scores = top_results.values.tolist()
        top_indices = top_results.indices.tolist()
        
        # We need to map indices back to missions, and deduplicate because multiple corpus entries map to the same mission.
        # So we collect the best score for each unique mission.
        mission_scores = {}
        for idx_tensor, score_tensor in zip(cos_scores.argsort(descending=True), cos_scores.sort(descending=True).values):
            idx = idx_tensor.item()
            score = score_tensor.item()
            mission = self._corpus_missions[idx]
            if mission not in mission_scores:
                mission_scores[mission] = score
                
        # Get top 3 unique missions
        top_unique_missions = list(mission_scores.items())[:3]
        if len(top_unique_missions) >= 3:
            score1 = top_unique_missions[0][1]
            score2 = top_unique_missions[1][1]
            score3 = top_unique_missions[2][1]
            
            # Confidence gap detection
            if (score1 - score2) < 0.05 and (score2 - score3) < 0.05:
                return MissionDetectionResponse(
                    detected_mission="UNKNOWN",
                    confidence=score1,
                    matched_keywords=[],
                    suggested_missions=[top_unique_missions[0][0], top_unique_missions[1][0], top_unique_missions[2][0]]
                )
                
        best_semantic_score = top_unique_missions[0][1] if top_unique_missions else 0.0
        best_semantic_mission = top_unique_missions[0][0] if top_unique_missions else "UNKNOWN"
        
        if best_semantic_score > 0.60 and best_semantic_score > best_confidence:
            best_confidence = best_semantic_score
            best_mission = best_semantic_mission
            best_matches = ["semantic_match"]
            
        if best_confidence < 0.60:
            suggested = [m for m, s in top_unique_missions] if top_unique_missions else ["BREAKFAST", "CHICKEN_BIRYANI", "PASTA_DINNER"]
            return MissionDetectionResponse(
                detected_mission="UNKNOWN",
                confidence=best_confidence,
                matched_keywords=[],
                suggested_missions=suggested
            )
            
        return MissionDetectionResponse(
            detected_mission=best_mission,
            confidence=best_confidence,
            matched_keywords=best_matches,
            suggested_missions=[]
        )
