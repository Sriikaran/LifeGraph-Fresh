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
    
    # 8 Indian commerce categories
    categories = {
        "FAMILY_EVENTS": 13,
        "FESTIVALS": 13,
        "SPIRITUAL": 13,
        "GROCERY": 13,
        "COOKING": 13,
        "STUDENT": 13,
        "HEALTH": 13,
        "TRAVEL": 13
    }
    
    # Mission templates (13 per category = 104 total missions)
    mission_templates = {
        "FAMILY_EVENTS": [
            ("birthday_party", "Birthday Party", "Organize a birthday celebration including food, cake, decorations, gifts and guest preparation."),
            ("kids_birthday_party", "Kids Birthday Party", "Plan a kid-friendly birthday party with toys, cake, snacks, balloons, and games."),
            ("housewarming_ceremony", "Housewarming Ceremony", "Traditional Griha Pravesh setup with sweets, return gifts, flowers, and lunch arrangements."),
            ("anniversary_celebration", "Anniversary Celebration", "Celebrate a marriage anniversary with flowers, cake, wine, dinner, and decorations."),
            ("baby_shower", "Baby Shower", "Traditional Godh Bharai or baby shower function with sweets, gifts, and decorations."),
            ("family_gathering", "Family Gathering", "Get-together for extended family with home-cooked meals, beverages, and music."),
            ("weekend_family_dinner", "Weekend Family Dinner", "Special weekend dinner with premium dishes, starters, and desserts."),
            ("engagement_party", "Engagement Party", "Roka or engagement ceremony preparation, clothing accessories, gifts, and food catering."),
            ("retirement_party", "Retirement Celebration", "Honoring career achievements with plaques, gifts, food, and family guests."),
            ("promotion_celebration", "Promotion Celebration", "Share success with colleagues and family using sweets, snacks, and drinks."),
            ("graduation_dinner", "Graduation Dinner", "Celebrate academic success with premium dinner, cake, and gift arrangements."),
            ("wedding_reception_prep", "Wedding Reception Prep", "Gathering decorations, stage items, return gifts, and special sweets for guests."),
            ("sunday_brunch", "Sunday Family Brunch", "Relaxing Sunday brunch with juices, waffles, parathas, and fresh fruits.")
        ],
        "FESTIVALS": [
            ("diwali_celebration", "Diwali Celebration", "Festival of lights setup with diyas, sweets, lights, rangoli, and pooja materials."),
            ("holi_celebration", "Holi Celebration", "Festival of colors with organic gulal, pichkaris, water balloons, sweets, and thandai."),
            ("ganesh_chaturthi", "Ganesh Chaturthi", "Eco-friendly Ganesha idol setup, modaks, flowers, durva grass, and decorations."),
            ("sankranti_festival", "Sankranti Festival", "Harvest festival preparation with sesame-jaggery laddu, kites, threads, and harvest crops."),
            ("ugadi_festival", "Ugadi Festival", "New Year celebration with Ugadi pachadi ingredients, mango leaves, and new clothes."),
            ("dussehra_celebration", "Dussehra Celebration", "Ayudha Pooja items, sweets, vehicle cleaning materials, and floral garlands."),
            ("raksha_bandhan", "Raksha Bandhan", "Rakhis, sweets, roli-chawal, chocolate gift boxes, and return gifts for sisters."),
            ("eid_celebration", "Eid Celebration", "Biryani ingredients, sheer khurma vermicelli, dry fruits, new clothes, and charity gifts."),
            ("christmas_celebration", "Christmas Celebration", "Christmas tree, ornaments, cakes, chocolates, star lanterns, and gifts."),
            ("janmashtami_festival", "Janmashtami Festival", "Lord Krishna birthday celebration, butter, flute, peacock feather, and panjiri sweets."),
            ("durga_pooja", "Durga Pooja Celebration", "Navratri pooja materials, traditional dresses, sweets, dhunuchi, and pandal lighting."),
            ("karwa_chauth", "Karwa Chauth Prep", "Sargi food items, decorated karwa pot, sieve, pooja thali, and traditional makeup cosmetics."),
            ("maha_shivratri", "Maha Shivratri", "Lord Shiva prayers with milk, honey, bael leaves, datura fruits, and fasting foods.")
        ],
        "SPIRITUAL": [
            ("satyanarayana_vratham", "Satyanarayana Vratham", "Traditional pooja kit, vratham story book, prasad ingredients, and kalasam items."),
            ("lakshmi_pooja", "Lakshmi Pooja", "Goddess Lakshmi worship with silver coins, lotus flowers, red cloth, and sweets."),
            ("ganesh_pooja", "Ganesh Pooja", "Daily or special Ganesha worship with coconuts, betel leaves, camphor, and agarbatti."),
            ("temple_visit_prep", "Temple Visit Preparation", "Pooja basket, flowers, coconut, camphor, matchbox, and modest traditional wear."),
            ("festival_pooja_kit", "Festival Pooja Kit", "Comprehensive set of pooja essential oils, kumkum, turmeric, sandal paste, and incense."),
            ("daily_home_mandir", "Daily Home Mandir Setup", "Fresh flowers, cotton wicks, oil for lamp, incense sticks, and matchboxes."),
            ("rudrabhishek_prep", "Rudrabhishek Preparation", "Panchamrit (milk, curd, ghee, honey, sugar), Ganga jal, and shivling accessories."),
            ("havan_yagna", "Havan Samagri Kit", "Havan wood, samagri mix, camphor, pure ghee, and copper havan kund."),
            ("vastu_shanti", "Vastu Shanti Pooja", "Home purification kit, copper plates, grains, thread, and coconut."),
            ("meditation_altar", "Meditation Altar Setup", "Singing bowl, diffuser, essential oils, dhoop cones, and yoga mat."),
            ("hanuman_chalisa_path", "Hanuman Chalisa Path", "Lord Hanuman photo frame, sindoor, oil, chalisa booklets, and boondi sweets."),
            ("saraswati_pooja", "Saraswati Pooja", "Worship of books, musical instruments, yellow flowers, and yellow sweets."),
            ("shradh_ceremony", "Shradh Ceremony Prep", "Rice balls, sesame seeds, darbha grass, white flowers, and dhoti.")
        ],
        "GROCERY": [
            ("weekly_grocery", "Weekly Grocery Refill", "Standard weekly replenishment of milk, bread, eggs, fresh vegetables, and fruits."),
            ("monthly_grocery", "Monthly Grocery Refill", "Monthly pantry stock up of rice, flour, cooking oil, pulses, and household cleaning supplies."),
            ("family_grocery", "Family Grocery Shopping", "Bulk pack sizes of staples, snacks, juices, and bath soaps for the whole household."),
            ("bachelor_grocery", "Bachelor Grocery Refill", "Easy-to-cook items, instant noodles, bread, eggs, biscuits, and soft drinks."),
            ("pantry_restock", "Essential Pantry Restock", "Spices, condiments, salt, sugar, tea leaves, coffee powder, and baking powder."),
            ("breakfast_staples", "Breakfast Staples Refill", "Poha, rava, oats, bread, butter, jam, cheese slices, and muesli."),
            ("fresh_produce_run", "Fresh Produce Run", "Seasonal green vegetables, onions, potatoes, tomatoes, and organic fruits."),
            ("beverage_stockup", "Beverage Stockup", "Fruit juices, carbonated water, tea, coffee, health drinks, and bottled water."),
            ("dairy_essential_run", "Dairy Essential Run", "Paneer, curd, milk, butter, cheese spread, and fresh cream."),
            ("cleaning_supplies", "Cleaning Supplies Refill", "Dishwash gel, floor cleaner, laundry detergent, toilet cleaner, and sponges."),
            ("snacks_munchies", "Snacks and Munchies Pack", "Namkeen, potato chips, roasted almonds, cookies, and chocolate bars."),
            ("organic_pantry_refill", "Organic Pantry Refill", "Organic brown rice, organic pulses, cold-pressed oils, and pink salt."),
            ("baking_essentials", "Baking Essentials Pack", "Maida, baking soda, cocoa powder, chocolate chips, and yeast.")
        ],
        "COOKING": [
            ("biryani_preparation", "Biryani Preparation", "Basmati rice, biryani masala, chicken or paneer, saffron, fried onions, and mint leaves."),
            ("paneer_butter_masala", "Paneer Butter Masala Dinner", "Paneer, butter, fresh cream, tomato puree, cashew paste, and kasuri methi."),
            ("south_indian_breakfast", "South Indian Breakfast", "Idli-dosa batter, sambhar powder, tamarind, curry leaves, mustard seeds, and coconut chutney ingredients."),
            ("family_lunch", "Family Lunch", "Rice, dal, vegetable stir fry (sabzi), roti, curd, and salad."),
            ("sunday_special_meal", "Sunday Special Meal", "Mutton or chicken curry, jeera rice, butter naan, and sweet raita."),
            ("samosa_chai_evening", "Samosa & Chai Evening", "Maida, potatoes, peas, spices, tea dust, milk, ginger, and cardamom."),
            ("pav_bhaji_feast", "Pav Bhaji Feast", "Pav buns, mixed vegetables, butter, pav bhaji masala, onions, and lemons."),
            ("chole_bhature_lunch", "Chole Bhature Lunch", "Kabuli chana, maida, curd, chole masala, green chilies, and coriander."),
            ("dal_makhani_dinner", "Dal Makhani Dinner", "Black urad dal, rajma, butter, cream, tomato paste, and garlic."),
            ("dhokla_breakfast", "Gujarati Dhokla Breakfast", "Besan, eno fruit salt, green chilies, mustard seeds, and curry leaves."),
            ("gulab_jamun_dessert", "Gulab Jamun Dessert", "Mawa/khoya, paneer, sugar, cardamom, and rose water."),
            ("kheer_preparation", "Kheer Preparation", "Rice, full cream milk, sugar, almonds, pistachios, and saffron."),
            ("healthy_khichdi", "Healthy Khichdi Meal", "Moong dal, rice, ghee, cumin seeds, ginger, and turmeric.")
        ],
        "STUDENT": [
            ("hostel_restocking", "Hostel Restocking", "Quick snacks, cup noodles, energy drinks, laundry bags, and toiletries."),
            ("exam_week_essentials", "Exam Week Essentials", "Coffee, dark chocolate, notebooks, pens, highlighters, and sticky notes."),
            ("late_night_study", "Late Night Study Session", "Instant noodles, potato chips, energy drinks, and table lamp bulb."),
            ("new_semester_setup", "New Semester Setup", "Backpack, notebooks, pens, geometry box, calculator, and folder organizers."),
            ("college_room_decor", "College Room Decor", "Fairy lights, posters, command hooks, bedsheet, and pillow."),
            ("hostel_first_aid", "Hostel First Aid Kit", "Bandages, pain relief spray, paracetamol, antiseptic cream, and cough syrup."),
            ("mess_escape_meal", "Mess Escape Meal Pack", "Maggi packets, peanut butter, bread loaf, cheese cubes, and fruit jam."),
            ("dorm_cleaning_kit", "Dorm Cleaning Kit", "Hand sanitizer, wet wipes, garbage bags, and room freshener spray."),
            ("project_work_kit", "Project Work Kit", "Chart papers, glue stick, scissors, colored markers, and presentation folder."),
            ("student_fitness_pack", "Student Fitness Pack", "Protein bars, shaker bottle, skipping rope, and whey protein powder."),
            ("monsoon_college_ready", "Monsoon College Ready", "Umbrella, raincoat, waterproof bag cover, and shoe wipes."),
            ("winter_hostel_prep", "Winter Hostel Prep", "Electric kettle, soup packets, thermal wear, and cold cream."),
            ("hostel_gaming_night", "Hostel Gaming Night", "Extension cord, gamer snacks, soft drinks, and earphones.")
        ],
        "HEALTH": [
            ("sick_day_recovery", "Sick Day Recovery", "ORS packets, thermometer, steam inhaler, herbal tea, and honey."),
            ("home_first_aid", "Home First Aid Kit", "Bandages, antiseptic solution, cotton roll, medical tape, and pain relief gel."),
            ("weight_loss_journey", "Weight Loss Journey", "Green tea, apple cider vinegar, oats, honey, chia seeds, and protein shaker."),
            ("protein_diet_plan", "Protein Diet Plan", "Whey protein, paneer, eggs, almonds, peanut butter, and soy chunks."),
            ("immunity_booster_pack", "Immunity Booster Pack", "Chyawanprash, turmeric extract, amla juice, honey, and giloy tablets."),
            ("diabetes_care_grocery", "Diabetes Care Grocery", "Oats, brown rice, low GI sweeteners, roasted chana, and sugar-free biscuits."),
            ("baby_health_wellness", "Baby Health & Wellness", "Baby wipes, baby lotion, rash cream, gripe water, and baby thermometer."),
            ("elderly_health_care", "Elderly Health Care", "Blood pressure monitor, pill organizer, adult diapers, pain relief spray, and joint support supplements."),
            ("post_workout_recovery", "Post Workout Recovery", "BCAA powder, protein bars, muscle spray, and multivitamin capsules."),
            ("digestive_wellness", "Digestive Wellness Kit", "Isabgol, gas relief tablets, buttermilk, mint capsules, and ginger tea."),
            ("stress_relief_wellness", "Stress Relief Wellness", "Lavender oil, chamomile tea, bath salts, scented candles, and stress balls."),
            ("hair_skin_care_regimen", "Hair & Skin Care Regimen", "Coconut oil, aloe vera gel, face wash, vitamin E capsules, and sunscreen."),
            ("eye_care_screen_user", "Eye Care for Screen Users", "Lubricating eye drops, blue light glasses, screen wipes, and vitamin A tablets.")
        ],
        "TRAVEL": [
            ("weekend_road_trip", "Weekend Road Trip", "Car mobile mount, car charger, snacks, travel pillow, and hand sanitizer."),
            ("pilgrimage_travel", "Pilgrimage Travel Prep", "Walking shoes, travel flask, small pooja basket, cash pouch, and wet wipes."),
            ("family_vacation_pack", "Family Vacation Packing", "Large suitcases, luggage tags, toiletries kit, travel adapters, and sunscreen."),
            ("train_journey_essentials", "Train Journey Essentials", "Train chain-lock, travel bedsheet, water flask, paper soaps, and dry snacks."),
            ("beach_holiday_pack", "Beach Holiday Packing", "Sunscreen, sunglasses, beach slippers, waterproof pouch, and quick-dry towel."),
            ("monsoon_trekking", "Monsoon Trekking Kit", "Rain ponchos, waterproof backpack, trekking shoes, torch, and leech repellent spray."),
            ("intl_flight_prep", "International Flight Prep", "Passport holder, neck pillow, noise-canceling earplugs, travel adapter, and pen."),
            ("camping_outdoor_kit", "Camping & Outdoor Kit", "Sleeping bag, mosquito repellent, power bank, camp torch, and multi-utility knife."),
            ("business_trip_ready", "Business Trip Preparation", "Garment bag, lint roller, travel iron, card holder, and notebook."),
            ("winter_mountain_trip", "Winter Mountain Trip", "Woolen socks, gloves, lip balm, moisturizer, and body warmers."),
            ("travel_toiletries_pack", "Travel Toiletries Pack", "Mini shampoo, toothbrush case, travel soap, hand towel, and comb."),
            ("adventure_sports_prep", "Adventure Sports Prep", "Action camera mount, hydration pack, sports sunscreen, and energy gels."),
            ("solo_traveler_safety", "Solo Traveler Safety Kit", "Pepper spray, personal alarm, hidden money belt, and door stopper lock.")
        ]
    }
    
    # Generate 1040 products (130 per category)
    products_by_category = {}
    
    # Sample real Indian items to populate the beginning of each category list
    category_real_products = {
        "FAMILY_EVENTS": [
            "birthday_cake", "party_balloons", "party_hats", "soft_drinks", "potato_chips", 
            "return_gifts", "decorative_lights", "marigold_garland", "sweets_box", "paper_plates",
            "birthday_candles", "banner_decorations", "party_poppers", "fruit_juice_pack", "chocolate_box"
        ],
        "FESTIVALS": [
            "clay_diyas", "marigold_garland", "rangoli_powder", "electric_led_serial_lights", "kaju_katli_sweets", 
            "organic_gulal", "pichkari_water_gun", "water_balloons", "eco_friendly_ganesha_idol", "modak_sweets",
            "kites_and_thread", "mango_leaves", "pooja_essential_kit", "roli_chawal_pack", "christmas_tree_ornaments"
        ],
        "SPIRITUAL": [
            "agarbatti_incense", "kumkum_turmeric_powder", "camphor_tablets", "puja_ghee_diya", "cotton_wicks_pack", 
            "coconut_shredded_whole", "pooja_brass_thali", "ganga_jal_bottle", "sandalwood_paste", "havan_samagri",
            "havan_kund_copper", "meditation_cushion", "hanuman_chalisa_book", "darbha_grass", "rudraksha_mala"
        ],
        "GROCERY": [
            "basmati_rice_5kg", "toor_dal_1kg", "ashirvaad_atta_5kg", "fortune_sunflower_oil_1l", "tata_salt_1kg", 
            "amul_butter_500g", "whole_milk_1l", "eggs_box_12", "britannia_bread_loaf", "tata_tea_gold_500g",
            "nescafe_classic_coffee", "surf_excel_detergent", "vim_dishwash_gel", "harpic_toilet_cleaner", "lizol_floor_cleaner"
        ],
        "COOKING": [
            "biryani_masala", "paneer_block_200g", "saffron_kesar", "mint_coriander_leaves", "fresh_cream_pack", 
            "tomato_puree_box", "cashew_nuts", "kasuri_methi", "dosa_batter_1kg", "sambar_powder",
            "tamarind_paste", "garam_masala_powder", "pav_buns_pack", "pav_bhaji_masala", "chole_masala"
        ],
        "STUDENT": [
            "maggi_noodles_12pack", "kurkure_masala_munch", "lays_chips_classic", "red_bull_energy", "classmate_notebooks", 
            "uniball_blue_pens", "sticky_notes", "geometry_box", "casio_scientific_calculator", "backpack_waterproof",
            "fairy_lights_led", "pain_relief_spray", "paracetamol_tablets", "dettol_antiseptic_liquid", "electric_kettle"
        ],
        "HEALTH": [
            "ors_electral_powder", "digital_thermometer", "steam_inhaler_vaporizer", "dabur_honey_500g", "dabur_chyawanprash_1kg", 
            "green_tea_bags", "apple_cider_vinegar", "chia_seeds_pack", "whey_protein_1kg", "protein_bars_multipack",
            "band_aid_washproof", "moov_pain_relief_gel", "blood_pressure_monitor", "pill_organizer", "adult_diaper_pack"
        ],
        "TRAVEL": [
            "car_mobile_mount", "travel_neck_pillow", "train_chain_lock", "water_flask_insulated", "backpack_45l", 
            "passport_holder_wallet", "travel_iron", "travel_toiletries_bottles", "paper_soap_strips", "rain_coat_umbrella",
            "sleeping_bag_outdoor", "mosquito_repellent_spray", "power_bank_20000mah", "camp_led_torch", "luggage_tags"
        ]
    }
    
    # Populate the products list per category, extending to 130 products per category
    for cat in categories.keys():
        real_list = category_real_products[cat]
        products_by_category[cat] = real_list + [f"prod_{cat.lower()}_{i}" for i in range(len(real_list) + 1, 131)]
        
    for cat, num_missions in categories.items():
        templates = mission_templates[cat]
        cat_products = products_by_category[cat]
        
        for idx in range(num_missions):
            m_id, m_name, m_desc = templates[idx]
            
            # Generate 20 required and 20 optional products per mission to reach 40 relationships
            req_list = []
            opt_list = []
            
            for offset in range(20):
                req_idx = (idx * 5 + offset) % len(cat_products)
                req_list.append(cat_products[req_idx])
                
                opt_idx = (idx * 5 + 20 + offset) % len(cat_products)
                opt_list.append(cat_products[opt_idx])
                
            # Generate 5 dependencies, 5 compatibilities, 5 substitutions -> 15 relationships
            dependencies = []
            compatibility = []
            substitutions = []
            
            for offset in range(5):
                src_req = req_list[offset]
                target_p = cat_products[(idx * 5 + 40 + offset) % len(cat_products)]
                dependencies.append(DependencyMapping(source=src_req, target=target_p))
                
                src_opt = opt_list[offset]
                target_c = cat_products[(idx * 5 + 50 + offset) % len(cat_products)]
                compatibility.append(CompatibilityMapping(source=src_opt, target=target_c))
                
                src_sub = cat_products[(idx * 5 + 60 + offset) % len(cat_products)]
                target_sub = req_list[offset + 5]
                substitutions.append(SubstitutionMapping(source=src_sub, target=target_sub))

            # Build keywords and synonyms
            keywords = [
                cat.lower(), 
                m_id.split("_")[0], 
                "india", 
                "indian_commerce", 
                "market", 
                "essentials"
            ]
            
            # Build synonyms list
            synonyms = [
                m_name.lower() + " items",
                m_name.lower() + " materials",
                m_name.lower() + " preparation",
                m_id.replace("_", " ") + " kit"
            ]
            
            # Build intent examples
            intent_examples = [
                f"I want to organize a {m_name.lower()}.",
                f"Need items for {m_name.lower()}.",
                f"Preparing for {m_name.lower()}.",
                f"What do I need for my {m_name.lower()} next week?"
            ]

            # Consumption Rules (2 per mission)
            consumption_rules = [
                ConsumptionRule(product=req_list[0], unit="pieces", serves_per_unit=4.0),
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
                synonyms=synonyms,
                intent_examples=intent_examples,
                consumption_rules=consumption_rules
            )
            missions.append(mission_req)

    return missions

def run_seeding():
    print("Generating large Indian commerce graph dataset...")
    missions = generate_graph_data()
    print(f"Generated {len(missions)} mission templates.")
    
    seeder = GraphSeederService()
    print("Beginning bulk population...")
    result = seeder.seed_bulk(missions)
    print("Response:", result)

if __name__ == "__main__":
    run_seeding()
