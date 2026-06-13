import os
import sys

# Add src to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

from shared.services.graph_seeder_service import GraphSeederService
from shared.schemas.graph_seeder_schemas import (
    MissionSeedRequest, DependencyMapping, CompatibilityMapping, SubstitutionMapping, ConsumptionRule
)

def generate_graph_data():
    missions = []
    
    # Categories definition
    categories = {
        "GROCERY": 15,
        "HEALTH": 10,
        "TRAVEL": 10,
        "ELECTRONICS": 10,
        "HOUSEHOLD": 10,
        "FRESH_MEAT": 10,
        "AMAZON_FRESH": 10
    }
    
    # Mission templates
    mission_templates = {
        "GROCERY": [
            ("birthday_party", "Birthday Party", "Organize a birthday celebration"),
            ("sunday_dinner", "Sunday Dinner", "Host a family Sunday dinner"),
            ("family_bbq", "Family BBQ", "Plan a backyard family barbecue"),
            ("movie_night", "Movie Night", "Host a movie night at home"),
            ("weekly_grocery", "Weekly Grocery Refill", "Standard weekly grocery refill"),
            ("pancake_breakfast", "Pancake Breakfast", "Cook a classic pancake breakfast"),
            ("wine_tasting", "Wine Tasting", "Host an elegant wine tasting evening"),
            ("taco_tuesday", "Taco Tuesday", "Prepare a delicious taco feast"),
            ("sushi_night", "Sushi Night", "Roll fresh homemade sushi"),
            ("pizza_party", "Pizza Party", "Bake customized pizzas at home"),
            ("salad_prep", "Salad Prep", "Prepare healthy salads for the week"),
            ("vegan_week", "Vegan Week", "Stock up on plant-based ingredients"),
            ("gluten_free", "Gluten-Free Meal", "Prepare a gluten-free dinner"),
            ("picnic_park", "Picnic in the Park", "Pack a lunch picnic"),
            ("kids_lunchbox", "Kids Lunchbox Prep", "Prepare nutritious lunchbox meals")
        ],
        "HEALTH": [
            ("sick_recovery", "Sick Day Recovery", "Recover from cold or flu"),
            ("first_aid_kit", "Home First Aid Kit", "Build a home emergency medical kit"),
            ("weight_loss", "Weight Loss Journey", "Start healthy portion control"),
            ("gym_pack", "Gym Starter Pack", "Gear up for gym workouts"),
            ("pregnancy_care", "Pregnancy Care", "Maternal health prep"),
            ("elder_care", "Elder Care Essentials", "Medical and comfort supplies for elders"),
            ("daily_vitamins", "Daily Vitamin Pack", "Set up daily nutritional supplements"),
            ("allergy_relief", "Allergy Relief Kit", "Manage seasonal allergies"),
            ("post_workout", "Post-Workout Recovery", "Support muscle repair post exercise"),
            ("sleep_aid", "Sleep Aid Kit", "Improve sleep hygiene and rest")
        ],
        "TRAVEL": [
            ("camping_trip", "Camping Trip", "Go outdoor tent camping"),
            ("road_trip", "Weekend Road Trip", "Pack for a weekend driving trip"),
            ("beach_vacation", "Beach Vacation", "Enjoy a sunny trip to the shore"),
            ("business_trip", "Business Trip Prep", "Pack for a corporate travel event"),
            ("european_tour", "European Tour Packing", "Supplies for international sightseeing"),
            ("ski_weekend", "Ski Weekend Packing", "Gear up for cold mountain slopes"),
            ("hiking_adventure", "Hiking Adventure", "Prepare for backcountry trail hiking"),
            ("intl_travel_pack", "International Travel Pack", "Essential adapters and travel safety gear"),
            ("disney_vacation", "Disneyland Vacation", "Prepare for a theme park family trip"),
            ("backpacking_prep", "Backpacking Trip Prep", "Pack ultra-light trail gear")
        ],
        "ELECTRONICS": [
            ("smartphone_setup", "Smartphone Setup", "Set up a new mobile phone"),
            ("wfh_setup", "Work From Home Setup", "Set up an ergonomic home office"),
            ("gaming_setup", "Gaming Setup", "Configure a high-performance gaming PC"),
            ("smart_home", "Smart Home Integration", "Connect smart lighting and assistants"),
            ("home_theater", "Home Theater Kit", "Install surround sound and screen gear"),
            ("vlogging_equip", "Vlogging Equipment Setup", "Set up video cameras and microphones"),
            ("podcast_starter", "Podcast Starter Pack", "Audio interfaces and studio gear"),
            ("backup_system", "Backup Drive System", "Secure redundant storage backups"),
            ("wifi_extender", "Wi-Fi Extender Setup", "Boost wireless coverage across the home"),
            ("travel_tech", "Travel Tech Pack", "Portable chargers and noise-cancelling headphones")
        ],
        "HOUSEHOLD": [
            ("new_apartment", "New Apartment Setup", "Move into a new apartment"),
            ("house_cleaning", "House Cleaning", "Perform deep home sanitization"),
            ("kitchen_essentials", "Kitchen Essentials", "Furnish basic cooking tools"),
            ("laundry_day", "Laundry Day Prep", "Wash, dry, and iron clothing"),
            ("baby_nursery", "Baby Nursery Prep", "Fulfill newborn room essentials"),
            ("garden_starter", "Garden Starter Kit", "Plant fresh herbs and flowers"),
            ("toolbox_essentials", "Tool Box Essentials", "Equip home maintenance handtools"),
            ("guest_room", "Guest Room Setup", "Make visiting guests comfortable"),
            ("bathroom_remodel", "Bathroom Essentials", "Upgrade basic towels and fixtures"),
            ("pet_dog", "Pet Dog Setup", "Prepare toys, food, and bedding for a puppy")
        ],
        "FRESH_MEAT": [
            ("steak_dinner", "Steak Dinner Night", "Cook premium ribeye and strip steaks"),
            ("chicken_prep", "Chicken Meal Prep", "Bake healthy organic chicken breast meals"),
            ("bbq_ribs", "BBQ Ribs Cookout", "Slow cook tender pork ribs on the grill"),
            ("sunday_roast", "Sunday Roast Beef", "Roast prime chuck beef with carrots"),
            ("turkey_feast", "Turkey Feast", "Roast a whole golden turkey for dinner"),
            ("seafood_bake", "Seafood Salmon Bake", "Bake fresh salmon fillets with dill"),
            ("lamb_kebab", "Lamb Kebab Night", "Skewer and grill spiced lamb chops"),
            ("pork_chop_dinner", "Pork Chop Roast", "Pan-sear thick-cut seasoned pork chops"),
            ("breakfast_sausage", "Breakfast Sausage Sizzle", "Fry bacon and breakfast sausage links"),
            ("ground_beef_tacos", "Ground Beef Tacos", "Brown seasoned lean ground beef 80/20")
        ],
        "AMAZON_FRESH": [
            ("smoothie_morning", "Morning Smoothie", "Blend organic bananas, strawberries, and yogurt"),
            ("fresh_salad", "Fresh Salad Prep", "Toss baby spinach, cherry tomatoes, and cucumbers"),
            ("fruit_party", "Fruit Basket Party", "Slice fresh apples, grapes, pineapples, and oranges"),
            ("cheese_board", "Dairy Cheese Board", "Arrange cheddar, gouda, brie, and crackers"),
            ("ice_cream_sundae", "Ice Cream Sundae", "Scoop vanilla bean ice cream with syrup and cherries"),
            ("organic_veggies", "Daily Organic Veggies", "Steam broccoli, carrots, cauliflower, and beans"),
            ("bread_bakery", "Fresh Bread Bakery", "Slice sourdough bread and baguettes with butter"),
            ("baking_pantry", "Baking Pantry Stock", "Stock flour, organic sugar, yeast, and vanilla"),
            ("snack_refill", "Healthy Snack Refill", "Bag almonds, walnuts, pretzels, and dried fruit"),
            ("morning_beverage", "Morning Beverage Brew", "Brew fresh roast coffee and organic tea")
        ]
    }

    # Generate 770 unique products (110 per category)
    products_by_category = {}
    for cat in categories.keys():
        if cat == "FRESH_MEAT":
            products_by_category[cat] = [
                "ribeye_steak", "new_york_strip", "filet_mignon", "ground_beef_80_20", "organic_chicken_breast",
                "chicken_wings", "pork_ribs", "pork_chops", "lamb_chops", "ground_turkey", "salmon_fillets",
                "fresh_shrimp", "smoked_bacon", "breakfast_sausage_links", "beef_brisket", "lamb_shank",
                "turkey_breast", "duck_breast", "cod_fillets", "sea_bass", "lobster_tail", "pork_tenderloin",
                "beef_short_ribs", "chicken_thighs", "ground_pork", "veal_chops", "chorizo_sausage", "italian_sausage"
            ] + [f"meat_item_{i}" for i in range(29, 111)]
        elif cat == "AMAZON_FRESH":
            products_by_category[cat] = [
                "organic_bananas", "honeycrisp_apples", "fresh_strawberries", "baby_spinach", "avocados",
                "roma_tomatoes", "sweet_onions", "whole_milk_gallon", "organic_eggs_dozen", "cheddar_cheese_block",
                "greek_yogurt_tub", "salted_butter_pack", "sour_cream", "french_baguette", "sourdough_bread_loaf",
                "all_purpose_flour", "organic_sugar", "baking_yeast", "vanilla_extract", "raw_almonds",
                "english_walnuts", "salted_pretzels", "dried_cranberries", "medium_roast_coffee", "green_tea_bags",
                "fresh_broccoli", "baby_carrots", "fresh_cauliflower", "green_beans", "red_grapes", "fresh_pineapple"
            ] + [f"fresh_item_{i}" for i in range(32, 111)]
        else:
            products_by_category[cat] = [f"prod_{cat.lower()}_{i}" for i in range(1, 111)]

    # Loop to generate missions
    for cat, num_missions in categories.items():
        templates = mission_templates[cat]
        cat_products = products_by_category[cat]
        
        for idx in range(num_missions):
            m_id, m_name, m_desc = templates[idx]
            
            req_list = []
            opt_list = []
            
            for offset in range(15):
                req_idx = (idx * 6 + offset) % len(cat_products)
                req_list.append(cat_products[req_idx])
                
                opt_idx = (idx * 6 + 15 + offset) % len(cat_products)
                opt_list.append(cat_products[opt_idx])
                
            # Generate 5 dependencies, 5 compatibilities, 5 substitutions
            dependencies = []
            compatibility = []
            substitutions = []
            
            for offset in range(5):
                src_req = req_list[offset]
                target_p = cat_products[(idx * 6 + 30 + offset) % len(cat_products)]
                dependencies.append(DependencyMapping(source=src_req, target=target_p))
                
                src_opt = opt_list[offset]
                target_c = cat_products[(idx * 6 + 40 + offset) % len(cat_products)]
                compatibility.append(CompatibilityMapping(source=src_opt, target=target_c))
                
                src_sub = cat_products[(idx * 6 + 50 + offset) % len(cat_products)]
                target_sub = req_list[offset + 5]
                substitutions.append(SubstitutionMapping(source=src_sub, target=target_sub))

            # Keywords
            keywords = [cat.lower(), m_id.split("_")[0], "essentials", "fresh", "fresh_meat"]

            # Consumption Rules (2 per mission)
            consumption_rules = [
                ConsumptionRule(product=req_list[0], unit="pieces", serves_per_unit=5.0),
                ConsumptionRule(product=req_list[1], unit="packs", serves_per_unit=2.0)
            ]

            mission_req = MissionSeedRequest(
                mission_id=m_id,
                name=m_name,
                description=m_desc,
                category=cat,
                required=req_list,
                optional=opt_list,
                dependencies=dependencies,
                compatibility=compatibility,
                substitutions=substitutions,
                keywords=keywords,
                consumption_rules=consumption_rules
            )
            missions.append(mission_req)

    return missions

def run_seeding():
    print("Generating large graph dataset...")
    missions = generate_graph_data()
    print(f"Generated {len(missions)} mission templates.")
    
    seeder = GraphSeederService()
    print("Beginning bulk population...")
    result = seeder.seed_bulk(missions)
    print("Response:", result)

if __name__ == "__main__":
    run_seeding()
