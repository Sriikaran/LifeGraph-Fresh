import re
from typing import Dict, Any, List

# Approved 20 missions
APPROVED_MISSIONS = {
    "monthly_grocery_refill": "Monthly Grocery Refill",
    "weekly_grocery_shopping": "Weekly Grocery Shopping",
    "family_breakfast_setup": "Family Breakfast Setup",
    "biryani_preparation": "Biryani Preparation",
    "weekend_cooking_session": "Weekend Cooking Session",
    "paneer_butter_masala_dinner": "Paneer Butter Masala Dinner",
    "diwali_celebration": "Diwali Celebration",
    "ganesh_chaturthi_preparation": "Ganesh Chaturthi Preparation",
    "sankranti_preparation": "Sankranti Preparation",
    "birthday_party": "Birthday Party",
    "housewarming_ceremony": "Housewarming Ceremony",
    "new_semester_setup": "New Semester Setup",
    "hostel_essentials_refill": "Hostel Essentials Refill",
    "exam_preparation_week": "Exam Preparation Week",
    "train_journey_snacks": "Train Journey Snacks",
    "road_trip_essentials": "Road Trip Essentials",
    "healthy_lifestyle_start": "Healthy Lifestyle Start",
    "weight_loss_journey": "Weight Loss Journey",
    "elderly_care_essentials": "Elderly Care Essentials",
    "family_gathering": "Family Gathering"
}

def enrich_product_metadata(title: str, current_category: str) -> Dict[str, Any]:
    """
    Analyzes product title and assigns corrected category, subcategory, semantic tags,
    and mission hints restricted only to the approved 20 missions.
    Also returns a formatted, normalized embeddingText string.
    """
    title_lower = str(title or "").lower()
    
    # 1. Normalize current category to match standard uppercase keys
    normalized_cat = str(current_category or "").strip().upper().replace(" ", "_").replace("-", "_")
    if "GROCERY" in normalized_cat:
        normalized_cat = "GROCERY"
    elif "COOKING" in normalized_cat:
        normalized_cat = "COOKING"
    elif "FESTIVAL" in normalized_cat:
        normalized_cat = "FESTIVALS"
    elif "EVENT" in normalized_cat:
        normalized_cat = "FAMILY_EVENTS"
    elif "STUDENT" in normalized_cat:
        normalized_cat = "STUDENT"
    elif "TRAVEL" in normalized_cat:
        normalized_cat = "TRAVEL"
    elif "HEALTH_AND_PERSONAL" in normalized_cat or "PERSONAL_CARE" in normalized_cat:
        normalized_cat = "HEALTH_AND_PERSONAL_CARE"
    elif "HEALTH" in normalized_cat:
        normalized_cat = "HEALTH"
    
    # Defaults
    category = normalized_cat
    subcategory = "General Grocery"
    tags = ["grocery", "food", "staple", "kitchen essentials"]
    hints = ["monthly_grocery_refill", "weekly_grocery_shopping"]

    # Refined rules
    rules = [
        # Oral Care
        (
            ["toothpaste", "toothbrush", "colgate", "oral", "brush", "mouthwash", "denture", "sensodyne", "pepsodent", "oral-b", "meswak", "floss"],
            "HEALTH_AND_PERSONAL_CARE", "Oral Care",
            ["toothpaste", "oral care", "brush", "hygiene", "personal care", "daily essentials"],
            ["monthly_grocery_refill", "weekly_grocery_shopping", "hostel_essentials_refill"]
        ),
        # Protein Supplements
        (
            ["whey", "protein powder", "muscleblaze", "protein shake", "protein supplement", "isolate whey", "creatine", "bcaa", "gainer"],
            "HEALTH_AND_PERSONAL_CARE", "Protein Supplements",
            ["protein", "fitness", "gym", "nutrition", "health", "supplement", "wellness"],
            ["healthy_lifestyle_start", "weight_loss_journey"]
        ),
        # Nutrition / Energy Bars
        (
            ["protein bar", "energy bar", "ritebite", "max protein", "yogabar protein"],
            "HEALTH_AND_PERSONAL_CARE", "Nutrition Bars",
            ["protein bar", "fitness", "snack", "energy bar", "nutrition", "supplement"],
            ["healthy_lifestyle_start", "weight_loss_journey", "train_journey_snacks"]
        ),
        # Home Comfort / Cushions
        (
            ["cushion", "pillow", "lumbar", "backrest", "foam chair", "chair cushion", "seat cushion", "mattress", "orthopedic support"],
            "HOME", "Home Comfort",
            ["cushion", "pillow", "ergonomic", "home", "comfort", "support", "orthopedic"],
            ["elderly_care_essentials", "road_trip_essentials"]
        ),
        # Tea
        (
            ["tea", "chai", "green tea", "black tea", "tea bag", "tea bags", "darjeeling tea", "assam tea", "taj mahal tea", "wagh bakri", "tata tea", "lipton"],
            "GROCERY", "Tea",
            ["tea", "chai", "beverage", "breakfast", "hot beverage", "staple"],
            ["monthly_grocery_refill", "weekly_grocery_shopping", "family_breakfast_setup", "family_gathering"]
        ),
        # Coffee
        (
            ["coffee", "nescafe", "bru", "davidoff", "filter coffee", "coffee beans", "instant coffee"],
            "GROCERY", "Coffee",
            ["coffee", "caffeine", "beverage", "breakfast", "hot beverage"],
            ["monthly_grocery_refill", "weekly_grocery_shopping", "family_breakfast_setup", "exam_preparation_week", "hostel_essentials_refill"]
        ),
        # Rice
        (
            ["basmati", "rice", "chaval"],
            "GROCERY", "Rice",
            ["rice", "basmati", "staple", "grain", "cooking"],
            ["monthly_grocery_refill", "weekly_grocery_shopping", "weekend_cooking_session", "biryani_preparation", "family_gathering"]
        ),
        # Spices & Seasonings
        (
            ["spices", "masala", "chilli", "mirch", "turmeric", "haldi", "jeera", "cumin", "clove", "cardamom", "elaichi", "pepper", "cinnamon", "mustard", "fennel", "hing", "coriander", "dhaniya", "garam masala", "biryani masala", "sambhar masala", "powder", "ginger", "garlic", "achar", "pickle", "saffron", "kesar"],
            "GROCERY", "Spices",
            ["spices", "cooking", "masala", "seasoning", "flavor", "indian cooking", "staple"],
            ["monthly_grocery_refill", "weekly_grocery_shopping", "weekend_cooking_session", "biryani_preparation", "paneer_butter_masala_dinner"]
        ),
        # Cakes / Bakery (lowercase "bakery" to match required subcategory)
        (
            ["cake", "pastry", "bakery"],
            "GROCERY", "bakery",
            ["cake", "bakery", "sweets", "celebration", "birthday", "party"],
            ["birthday_party", "family_gathering"]
        ),
        # Candles
        (
            ["candle", "candles"],
            "GROCERY", "bakery",
            ["candles", "party", "celebration", "decor", "birthday"],
            ["birthday_party", "diwali_celebration"]
        ),
        # Garlands & Diyas (subcategory decorations lowercase)
        (
            ["diya", "diyas", "garland", "garlands", "flower garland", "marigold"],
            "FESTIVALS", "decorations",
            ["festival", "pooja", "spiritual", "worship", "diwali", "decor", "tradition"],
            ["diwali_celebration", "ganesh_chaturthi_preparation", "sankranti_preparation", "birthday_party"]
        ),
        # Flour & Atta
        (
            ["atta", "flour", "maida", "sooji", "wheat flour", "besan", "soya flour", "dalia", "oats"],
            "GROCERY", "Flour & Atta",
            ["flour", "atta", "wheat", "staple", "cooking", "roti", "breakfast"],
            ["monthly_grocery_refill", "weekly_grocery_shopping", "family_breakfast_setup", "weekend_cooking_session", "paneer_butter_masala_dinner"]
        ),
        # Paneer & Dairy
        (
            ["paneer", "tofu", "milk", "curd", "yogurt", "cheese", "butter", "ghee", "dairy"],
            "GROCERY", "Dairy & Alternatives",
            ["dairy", "milk", "paneer", "tofu", "butter", "breakfast", "cooking", "calcium"],
            ["monthly_grocery_refill", "weekly_grocery_shopping", "family_breakfast_setup", "weekend_cooking_session", "paneer_butter_masala_dinner"]
        ),
        # Cereals & Breakfast Foods
        (
            ["cereal", "muesli", "flakes", "krunch", "ragi flakes", "corn flakes"],
            "GROCERY", "Cereals",
            ["cereal", "breakfast", "muesli", "flakes", "morning meal", "quick meal"],
            ["monthly_grocery_refill", "weekly_grocery_shopping", "family_breakfast_setup", "hostel_essentials_refill"]
        ),
        # Festivals & Pooja Supplies general
        (
            ["pooja", "puja", "ganesha", "ganesh", "idol", "camphor", "agarbatti", "incense", "kumkum", "haldi-kumkum", "coconut", "havan", "sesame", "jaggery"],
            "FESTIVALS", "Pooja & Festival Supplies",
            ["festival", "pooja", "spiritual", "worship", "diwali", "ganesh", "tradition"],
            ["diwali_celebration", "ganesh_chaturthi_preparation", "sankranti_preparation"]
        ),
        # Travel & Luggage
        (
            ["backpack", "luggage", "bag", "lock", "train lock", "chain lock", "suitcases", "travel pillow"],
            "TRAVEL", "travel",
            ["travel", "bag", "backpack", "security", "luggage", "journey"],
            ["road_trip_essentials", "train_journey_snacks", "hostel_essentials_refill"]
        ),
        # Student Supplies
        (
            ["notebook", "pen", "pencil", "calculator", "folder", "stationery", "exam pad"],
            "STUDENT", "study",
            ["student", "stationery", "study", "exam", "notebook", "school", "college"],
            ["new_semester_setup", "exam_preparation_week", "hostel_essentials_refill"]
        ),
        # Elderly Care & Health
        (
            ["sugar free", "low calorie", "orthopedic", "diabetic", "comfit", "pain relief", "first aid", "bandage", "thermometer", "antiseptic", "dettol"],
            "HEALTH_AND_PERSONAL_CARE", "Personal Care & Wellness",
            ["health", "wellness", "elderly care", "care", "medical", "first aid"],
            ["elderly_care_essentials", "healthy_lifestyle_start"]
        ),
        # Snacks & Biscuits
        (
            ["biscuit", "cookie", "oreo", "bourbon", "nankatai", "wafer", "fryum", "papad", "popcorn", "snack", "chips", "lays", "kurkure", "namkeen", "bhujia", "candy", "chocolate", "sweets"],
            "GROCERY", "Snacks & Confectionery",
            ["snack", "biscuit", "cookie", "chocolate", "sweets", "confectionery", "munchies"],
            ["weekly_grocery_shopping", "train_journey_snacks", "road_trip_essentials", "birthday_party", "diwali_celebration", "exam_preparation_week", "hostel_essentials_refill", "family_gathering"]
        )
    ]

    # Evaluate rules
    matched = False
    for kws, cat, subcat, tg, hn in rules:
        if any(kw in title_lower for kw in kws):
            category = cat
            subcategory = subcat
            tags = tg
            hints = hn
            matched = True
            break

    # Adjust default subcategory if unmatched but normalized category has specific target
    if not matched:
        if category == "TRAVEL":
            subcategory = "travel"
        elif category == "STUDENT":
            subcategory = "study"
        elif category == "FESTIVALS":
            subcategory = "decorations"
        elif category == "FAMILY_EVENTS":
            subcategory = "bakery"
        else:
            subcategory = "General Grocery"

    # Build embedding text source field
    embedding_text = f"title: {title} | category: {category} | subcategory: {subcategory} | semanticTags: {', '.join(tags)} | missionHints: {', '.join(hints)}"

    return {
        "category": category,
        "subcategory": subcategory,
        "semanticTags": tags,
        "missionHints": hints,
        "embeddingText": embedding_text
    }
