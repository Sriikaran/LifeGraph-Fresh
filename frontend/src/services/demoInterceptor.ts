import type { OutcomeResponse } from './outcomeApi';

export function checkDemoMode(query: string): OutcomeResponse | null {
  const q = query.trim().toLowerCase();

  if (q === 'movie night' || q === 'having friends over for a movie night') {
    return {
      status: 'success',
      mission: { detected_mission: 'Movie Night', parameters: {}, confidence: 1.0 },
      verification: {
        readiness_score: 88,
        readiness_breakdown: {},
        required_items: [],
        missing_items: ["veganic_rice_kachari_400gm_salted_rice_wafer_fryum_rice_finger_papad_sun_dried_rice_kurdai_chaval_charauri_tilo", "toblerone_swiss_dark_tiny_chocolate_272_gm_34_pieces", "boost_chocolate_energy_sports_nutrition_drink_500_g_pet_jar_for_3x_stamina_builds_bone_muscle_strength", "lotus_biscoff_cookies_caramelized_biscuit_cookie_250_gram_non_gmo_project_verified_and_vegan", "cadbury_oreo_vanilla_flavour_cookie_sandwich_cream_biscuit_113_75g_120g_grammage_may_vary", "dry_fruit_hub_sprinkles_choco_chips_combo_450gms_sprinkles_for_cake_decoration_125gm_tutty_fruity_100gm_dark_choco_chip", "lotus_biscoff_cookies_caramelized_biscuit_cookie_2p_x_8_counts_124_gram_non_gmo_project_verified_and_vegan", "ferrero_rocher_premium_milk_chocolate_300g_24_pieces"],
        critical_missing: [],
        important_missing: ["veganic_rice_kachari_400gm_salted_rice_wafer_fryum_rice_finger_papad_sun_dried_rice_kurdai_chaval_charauri_tilo", "toblerone_swiss_dark_tiny_chocolate_272_gm_34_pieces", "boost_chocolate_energy_sports_nutrition_drink_500_g_pet_jar_for_3x_stamina_builds_bone_muscle_strength", "lotus_biscoff_cookies_caramelized_biscuit_cookie_250_gram_non_gmo_project_verified_and_vegan"],
        optional_missing: ["cadbury_oreo_vanilla_flavour_cookie_sandwich_cream_biscuit_113_75g_120g_grammage_may_vary", "dry_fruit_hub_sprinkles_choco_chips_combo_450gms_sprinkles_for_cake_decoration_125gm_tutty_fruity_100gm_dark_choco_chip", "lotus_biscoff_cookies_caramelized_biscuit_cookie_2p_x_8_counts_124_gram_non_gmo_project_verified_and_vegan", "ferrero_rocher_premium_milk_chocolate_300g_24_pieces"],
        recommended_products: ["act_ii_instant_popcorn_golden_sizzle_60g_pack_of_3", "cadbury_dairy_milk_chocolate_home_treats_pack_126g", "saptamveda_100_organic_amla_indian_gooseberry_powder_150gm_drinking_eating_hair_nourishment_repair_damage_hair_sk", "luvit_cocoa_crush_dark_milk_compound_bars_frosting_chocolate_making_perfect_for_baking_no_preservatives_pack_o", "cadbury_oreo_vanilla_flavour_cookie_sandwich_cream_biscuit_family_pack_pack_of_4_x_288_75g_pack_of_4_x_300g_grammage_may", "hershey_s_chocolate_syrup_200g", "tropicana_mixed_fruit_juice_1_litre", "too_yumm_multigrain_chips_dahi_papdi_chaat_54g", "britannia_vita_marie_gold_biscuits_978g", "early_foods_dry_fruit_jaggery_cookies_2_x_150_g", "lotus_biscoff_cookies_caramelized_biscuit_cookie_1p_x_25_cookies_individually_wrapped_156_gram_non_gmo_project_ver", "sunfeast_dark_fantasy_bourbon_classic_with_real_chocolate_100g"]
      },
      risk: {
        risk_score: 12,
        risk_level: 'Low',
        risks: []
      },
      simulation: {
        current_success: 50,
        optimized_success: 92,
        improvement: 42,
        recommended_additions: ["act_ii_instant_popcorn_golden_sizzle_60g_pack_of_3", "cadbury_dairy_milk_chocolate_home_treats_pack_126g", "saptamveda_100_organic_amla_indian_gooseberry_powder_150gm_drinking_eating_hair_nourishment_repair_damage_hair_sk", "luvit_cocoa_crush_dark_milk_compound_bars_frosting_chocolate_making_perfect_for_baking_no_preservatives_pack_o", "cadbury_oreo_vanilla_flavour_cookie_sandwich_cream_biscuit_family_pack_pack_of_4_x_288_75g_pack_of_4_x_300g_grammage_may", "hershey_s_chocolate_syrup_200g", "tropicana_mixed_fruit_juice_1_litre", "too_yumm_multigrain_chips_dahi_papdi_chaat_54g", "britannia_vita_marie_gold_biscuits_978g", "early_foods_dry_fruit_jaggery_cookies_2_x_150_g", "lotus_biscoff_cookies_caramelized_biscuit_cookie_1p_x_25_cookies_individually_wrapped_156_gram_non_gmo_project_ver", "sunfeast_dark_fantasy_bourbon_classic_with_real_chocolate_100g"]
      },
      mission_coherence_score: 92
    };
  }

  if (q === 'weight loss' || q === 'i am starting a weight loss journey') {
    return {
      status: 'success',
      mission: { detected_mission: 'Weight Loss Journey', parameters: {}, confidence: 1.0 },
      verification: {
        readiness_score: 91,
        readiness_breakdown: {},
        required_items: [],
        missing_items: ["koko_krunch_nestle_cereal_1kg_choco_flakes_made_with_3_grains_and_no_maida_contains_immuno_nutrients", "aashirvaad_nature_s_superfoods_gluten_free_flour_500g_pack_super_nutritious_flour", "coco_mama_coconut_water_tetrapak_250_ml", "pure_nuts_dry_fruits_combo_pack_250g_4_1kg_almonds_cashews_pistachios_raisins_all_premium", "chetran_s_fresh_tofu_250_g_dairy_paneer_alternative_high_protein", "ritebite_max_protein_daily_choco_almond_10g_protein_bars_pack_of_24_protein_blend_fiber_vitamins_minerals_no_prese", "muscleblaze_whey_gold_100_whey_protein_isolate_labdoor_usa_certified_25_g_pure_isolate_whey_per_scoop_rich_milk_choco", "yogabar_protein_bars_assorted_pack_of_6_20g_protein_bar_energy_bars_added_probiotics_whey_20g_protein_10g_fibr"],
        critical_missing: [],
        important_missing: ["koko_krunch_nestle_cereal_1kg_choco_flakes_made_with_3_grains_and_no_maida_contains_immuno_nutrients", "aashirvaad_nature_s_superfoods_gluten_free_flour_500g_pack_super_nutritious_flour", "coco_mama_coconut_water_tetrapak_250_ml", "pure_nuts_dry_fruits_combo_pack_250g_4_1kg_almonds_cashews_pistachios_raisins_all_premium"],
        optional_missing: ["chetran_s_fresh_tofu_250_g_dairy_paneer_alternative_high_protein", "ritebite_max_protein_daily_choco_almond_10g_protein_bars_pack_of_24_protein_blend_fiber_vitamins_minerals_no_prese", "muscleblaze_whey_gold_100_whey_protein_isolate_labdoor_usa_certified_25_g_pure_isolate_whey_per_scoop_rich_milk_choco", "yogabar_protein_bars_assorted_pack_of_6_20g_protein_bar_energy_bars_added_probiotics_whey_20g_protein_10g_fibr"],
        recommended_products: ["raghbat_premium_california_roasted_salted_jumbo_size_pistachios_nut_1kg_family_value_pack_pista_dry_fruit_super_crun", "amazon_brand_vedaka_organic_raw_peanut_1kg", "r_r_agro_foods_chia_seeds_1_kg_premium_organic_chia_seed_healthy_snacks_chia_seeds_for_weight_loss_pack_of_1", "manna_kodo_millet_kodri_natural_grains_1kg_500g_x_2_packs_kodra_varagu_arikelu_hark_varigu_native_low_gi_mille", "paperboat_swing_lush_lychee_juice_with_vitamin_d_600_ml_each_pack_of_6", "nutmart_premium_sunflower_seeds_1_kg_rs_375", "nutella_hazelnut_spread_with_cocoa_750g_jar", "saffola_fittify_tasty_peanut_butter_dark_chocolaty_extra_crunchy_high_protein_high_fiber_vegan_no_trans_fat_925g", "jabsons_roasted_peanut_diffrent_flavours", "thanjai_natural_millet_noodles_180_grams_x_4_varities_720_grams_of_homemade_natural_foxtail_horsegram_ragi_and_red_r", "myfitness_natural_peanut_butter_smooth_1250g", "mcaffeine_green_tea_skin_care_gift_set_with_goodness_of_vitamin_c_for_all_ocassions_gender_neutral_100_natural_prod"]
      },
      risk: {
        risk_score: 8,
        risk_level: 'Low',
        risks: []
      },
      simulation: {
        current_success: 50,
        optimized_success: 95,
        improvement: 45,
        recommended_additions: ["raghbat_premium_california_roasted_salted_jumbo_size_pistachios_nut_1kg_family_value_pack_pista_dry_fruit_super_crun", "amazon_brand_vedaka_organic_raw_peanut_1kg", "r_r_agro_foods_chia_seeds_1_kg_premium_organic_chia_seed_healthy_snacks_chia_seeds_for_weight_loss_pack_of_1", "manna_kodo_millet_kodri_natural_grains_1kg_500g_x_2_packs_kodra_varagu_arikelu_hark_varigu_native_low_gi_mille", "paperboat_swing_lush_lychee_juice_with_vitamin_d_600_ml_each_pack_of_6", "nutmart_premium_sunflower_seeds_1_kg_rs_375", "nutella_hazelnut_spread_with_cocoa_750g_jar", "saffola_fittify_tasty_peanut_butter_dark_chocolaty_extra_crunchy_high_protein_high_fiber_vegan_no_trans_fat_925g", "jabsons_roasted_peanut_diffrent_flavours", "thanjai_natural_millet_noodles_180_grams_x_4_varities_720_grams_of_homemade_natural_foxtail_horsegram_ragi_and_red_r", "myfitness_natural_peanut_butter_smooth_1250g", "mcaffeine_green_tea_skin_care_gift_set_with_goodness_of_vitamin_c_for_all_ocassions_gender_neutral_100_natural_prod"]
      },
      mission_coherence_score: 95
    };
  }

  if (q === 'healthy breakfast' || q === 'i need to start eating a healthy breakfast') {
    return {
      status: 'success',
      mission: { detected_mission: 'Healthy Breakfast', parameters: {}, confidence: 1.0 },
      verification: {
        readiness_score: 89,
        readiness_breakdown: {},
        required_items: [],
        missing_items: ["pure_nuts_dry_fruits_combo_pack_250g_4_1kg_almonds_cashews_pistachios_raisins_all_premium", "r_r_agro_foods_chia_seeds_1_kg_premium_organic_chia_seed_healthy_snacks_chia_seeds_for_weight_loss_pack_of_1", "paperboat_swing_lush_lychee_juice_with_vitamin_d_600_ml_each_pack_of_6", "bevzilla_premium_gift_box_of_4_coffee_powder_jars_25_gms_each_coffee_travel_mug_electric_frother_strong_coffee_100", "nescafe_gold_origins_indonesian_sumatra_coffee_bottle_100g", "myfitness_natural_peanut_butter_smooth_1250g", "mcaffeine_green_tea_skin_care_gift_set_with_goodness_of_vitamin_c_for_all_ocassions_gender_neutral_100_natural_prod", "nature_prime_100_natural_premium_mix_dry_fruits_and_nuts_1_kg_almonds_cashew_kishmish_apricot_black_raisins_kiwi_dr"],
        critical_missing: [],
        important_missing: ["pure_nuts_dry_fruits_combo_pack_250g_4_1kg_almonds_cashews_pistachios_raisins_all_premium", "r_r_agro_foods_chia_seeds_1_kg_premium_organic_chia_seed_healthy_snacks_chia_seeds_for_weight_loss_pack_of_1", "paperboat_swing_lush_lychee_juice_with_vitamin_d_600_ml_each_pack_of_6", "bevzilla_premium_gift_box_of_4_coffee_powder_jars_25_gms_each_coffee_travel_mug_electric_frother_strong_coffee_100"],
        optional_missing: ["nescafe_gold_origins_indonesian_sumatra_coffee_bottle_100g", "myfitness_natural_peanut_butter_smooth_1250g", "mcaffeine_green_tea_skin_care_gift_set_with_goodness_of_vitamin_c_for_all_ocassions_gender_neutral_100_natural_prod", "nature_prime_100_natural_premium_mix_dry_fruits_and_nuts_1_kg_almonds_cashew_kishmish_apricot_black_raisins_kiwi_dr"],
        recommended_products: ["tata_coffee_gold_100_pure_coffee_original_50g", "happilo_premium_international_healthy_nutmix_350g_value_pack_almonds_black_raisins_cashewnuts_cranberries_green_rais", "exotes_popular_almonds_vacuum_pouch_250_g", "sunbean_beaten_caffe_instant_coffee_paste_250g_jar_rich_creamy_and_frothy_beaten_coffee_make_hot_coffee_cappuccino", "avg_giloy_tulsi_amla_ashwagandha_premium_herbal_juice_immunity_booster_1l", "black_reaper_shoreditch_blend_dark_roast_250g_freshly_ground_coffee_beans_powder_strong", "tropicana_mixed_fruit_juice_1_litre", "kissan_crunchy_peanut_butter_high_protein_with_perfectly_roasted_peanuts_naturally_gluten_free_920_g", "nestea_instant_iced_tea_green_tea_mint_flavour_400g", "tgl_co_the_good_life_company_kashmiri_kahwa_green_tea_16_tea_bags_15_tea_bags_with_1_exotic_sample", "starbucks_single_origin_sumatra_coffee_dark_roast_coffee_capsule_by_nespresso_intensity_10_55g", "typhoo_uplifting_lemon_grass_green_tea_bags_25_tea_bags"]
      },
      risk: {
        risk_score: 10,
        risk_level: 'Low',
        risks: []
      },
      simulation: {
        current_success: 50,
        optimized_success: 93,
        improvement: 43,
        recommended_additions: ["tata_coffee_gold_100_pure_coffee_original_50g", "happilo_premium_international_healthy_nutmix_350g_value_pack_almonds_black_raisins_cashewnuts_cranberries_green_rais", "exotes_popular_almonds_vacuum_pouch_250_g", "sunbean_beaten_caffe_instant_coffee_paste_250g_jar_rich_creamy_and_frothy_beaten_coffee_make_hot_coffee_cappuccino", "avg_giloy_tulsi_amla_ashwagandha_premium_herbal_juice_immunity_booster_1l", "black_reaper_shoreditch_blend_dark_roast_250g_freshly_ground_coffee_beans_powder_strong", "tropicana_mixed_fruit_juice_1_litre", "kissan_crunchy_peanut_butter_high_protein_with_perfectly_roasted_peanuts_naturally_gluten_free_920_g", "nestea_instant_iced_tea_green_tea_mint_flavour_400g", "tgl_co_the_good_life_company_kashmiri_kahwa_green_tea_16_tea_bags_15_tea_bags_with_1_exotic_sample", "starbucks_single_origin_sumatra_coffee_dark_roast_coffee_capsule_by_nespresso_intensity_10_55g", "typhoo_uplifting_lemon_grass_green_tea_bags_25_tea_bags"]
      },
      mission_coherence_score: 93
    };
  }

  if (q === 'study session' || q === 'i need snacks and energy for a late night study session') {
    return {
      status: 'success',
      mission: { detected_mission: 'Late Night Study Session', parameters: {}, confidence: 1.0 },
      verification: {
        readiness_score: 85,
        readiness_breakdown: {},
        required_items: [],
        missing_items: ["veganic_rice_kachari_400gm_salted_rice_wafer_fryum_rice_finger_papad_sun_dried_rice_kurdai_chaval_charauri_tilo", "toblerone_swiss_dark_tiny_chocolate_272_gm_34_pieces", "boost_chocolate_energy_sports_nutrition_drink_500_g_pet_jar_for_3x_stamina_builds_bone_muscle_strength", "horlicks_health_and_nutrition_drink_500_g_pet_jar_chocolate_flavor", "lotus_biscoff_cookies_caramelized_biscuit_cookie_250_gram_non_gmo_project_verified_and_vegan", "ritebite_max_protein_choco_delite_energy_snack_bar_with_oats_almonds_dark_chocolate_480g_pack_of_12", "cadbury_oreo_vanilla_flavour_cookie_sandwich_cream_biscuit_113_75g_120g_grammage_may_vary", "dry_fruit_hub_sprinkles_choco_chips_combo_450gms_sprinkles_for_cake_decoration_125gm_tutty_fruity_100gm_dark_choco_chip"],
        critical_missing: [],
        important_missing: ["veganic_rice_kachari_400gm_salted_rice_wafer_fryum_rice_finger_papad_sun_dried_rice_kurdai_chaval_charauri_tilo", "toblerone_swiss_dark_tiny_chocolate_272_gm_34_pieces", "boost_chocolate_energy_sports_nutrition_drink_500_g_pet_jar_for_3x_stamina_builds_bone_muscle_strength", "horlicks_health_and_nutrition_drink_500_g_pet_jar_chocolate_flavor"],
        optional_missing: ["lotus_biscoff_cookies_caramelized_biscuit_cookie_250_gram_non_gmo_project_verified_and_vegan", "ritebite_max_protein_choco_delite_energy_snack_bar_with_oats_almonds_dark_chocolate_480g_pack_of_12", "cadbury_oreo_vanilla_flavour_cookie_sandwich_cream_biscuit_113_75g_120g_grammage_may_vary", "dry_fruit_hub_sprinkles_choco_chips_combo_450gms_sprinkles_for_cake_decoration_125gm_tutty_fruity_100gm_dark_choco_chip"],
        recommended_products: ["omas_fresh_jain_indian_magic_masala_68gms_no_onion_no_garlic_masala_noodles_masala_jain", "bevzilla_premium_gift_box_of_4_coffee_powder_jars_25_gms_each_coffee_travel_mug_electric_frother_strong_coffee_100", "nescafe_gold_origins_indonesian_sumatra_coffee_bottle_100g", "thanjai_natural_millet_noodles_180_grams_x_4_varities_720_grams_of_homemade_natural_foxtail_horsegram_ragi_and_red_r", "lotus_biscoff_cookies_caramelized_biscuit_cookie_2p_x_8_counts_124_gram_non_gmo_project_verified_and_vegan", "horlicks_health_nutrition_drink_chocolate_pouch_500_g", "ferrero_rocher_premium_milk_chocolate_300g_24_pieces", "tata_coffee_gold_100_pure_coffee_original_50g", "cadbury_dairy_milk_chocolate_home_treats_pack_126g", "sunbean_beaten_caffe_instant_coffee_paste_250g_jar_rich_creamy_and_frothy_beaten_coffee_make_hot_coffee_cappuccino", "black_reaper_shoreditch_blend_dark_roast_250g_freshly_ground_coffee_beans_powder_strong", "luvit_cocoa_crush_dark_milk_compound_bars_frosting_chocolate_making_perfect_for_baking_no_preservatives_pack_o"]
      },
      risk: {
        risk_score: 15,
        risk_level: 'Medium',
        risks: []
      },
      simulation: {
        current_success: 50,
        optimized_success: 90,
        improvement: 40,
        recommended_additions: ["omas_fresh_jain_indian_magic_masala_68gms_no_onion_no_garlic_masala_noodles_masala_jain", "bevzilla_premium_gift_box_of_4_coffee_powder_jars_25_gms_each_coffee_travel_mug_electric_frother_strong_coffee_100", "nescafe_gold_origins_indonesian_sumatra_coffee_bottle_100g", "thanjai_natural_millet_noodles_180_grams_x_4_varities_720_grams_of_homemade_natural_foxtail_horsegram_ragi_and_red_r", "lotus_biscoff_cookies_caramelized_biscuit_cookie_2p_x_8_counts_124_gram_non_gmo_project_verified_and_vegan", "horlicks_health_nutrition_drink_chocolate_pouch_500_g", "ferrero_rocher_premium_milk_chocolate_300g_24_pieces", "tata_coffee_gold_100_pure_coffee_original_50g", "cadbury_dairy_milk_chocolate_home_treats_pack_126g", "sunbean_beaten_caffe_instant_coffee_paste_250g_jar_rich_creamy_and_frothy_beaten_coffee_make_hot_coffee_cappuccino", "black_reaper_shoreditch_blend_dark_roast_250g_freshly_ground_coffee_beans_powder_strong", "luvit_cocoa_crush_dark_milk_compound_bars_frosting_chocolate_making_perfect_for_baking_no_preservatives_pack_o"]
      },
      mission_coherence_score: 90
    };
  }

  if (q === 'train journey' || q === 'i am packing snacks for a long train journey') {
    return {
      status: 'success',
      mission: { detected_mission: 'Train Journey Snacks', parameters: {}, confidence: 1.0 },
      verification: {
        readiness_score: 84,
        readiness_breakdown: {},
        required_items: [],
        missing_items: ["veganic_rice_kachari_400gm_salted_rice_wafer_fryum_rice_finger_papad_sun_dried_rice_kurdai_chaval_charauri_tilo", "toblerone_swiss_dark_tiny_chocolate_272_gm_34_pieces", "boost_chocolate_energy_sports_nutrition_drink_500_g_pet_jar_for_3x_stamina_builds_bone_muscle_strength", "coco_mama_coconut_water_tetrapak_250_ml", "pure_nuts_dry_fruits_combo_pack_250g_4_1kg_almonds_cashews_pistachios_raisins_all_premium", "ritebite_max_protein_daily_choco_almond_10g_protein_bars_pack_of_24_protein_blend_fiber_vitamins_minerals_no_prese", "parle_platina_hide_seek_black_bourbon_vanilla_300g", "horlicks_health_and_nutrition_drink_500_g_pet_jar_chocolate_flavor"],
        critical_missing: [],
        important_missing: ["veganic_rice_kachari_400gm_salted_rice_wafer_fryum_rice_finger_papad_sun_dried_rice_kurdai_chaval_charauri_tilo", "toblerone_swiss_dark_tiny_chocolate_272_gm_34_pieces", "boost_chocolate_energy_sports_nutrition_drink_500_g_pet_jar_for_3x_stamina_builds_bone_muscle_strength", "coco_mama_coconut_water_tetrapak_250_ml"],
        optional_missing: ["pure_nuts_dry_fruits_combo_pack_250g_4_1kg_almonds_cashews_pistachios_raisins_all_premium", "ritebite_max_protein_daily_choco_almond_10g_protein_bars_pack_of_24_protein_blend_fiber_vitamins_minerals_no_prese", "parle_platina_hide_seek_black_bourbon_vanilla_300g", "horlicks_health_and_nutrition_drink_500_g_pet_jar_chocolate_flavor"],
        recommended_products: ["lotus_biscoff_cookies_caramelized_biscuit_cookie_250_gram_non_gmo_project_verified_and_vegan", "alkalen_water_based_electrolyte_drink_ph_alkaline_8_5_to_9_5_1_l_pack_of_12", "raghbat_premium_california_roasted_salted_jumbo_size_pistachios_nut_1kg_family_value_pack_pista_dry_fruit_super_crun", "r_r_agro_foods_chia_seeds_1_kg_premium_organic_chia_seed_healthy_snacks_chia_seeds_for_weight_loss_pack_of_1", "ritebite_max_protein_choco_delite_energy_snack_bar_with_oats_almonds_dark_chocolate_480g_pack_of_12", "cadbury_oreo_vanilla_flavour_cookie_sandwich_cream_biscuit_113_75g_120g_grammage_may_vary", "dry_fruit_hub_sprinkles_choco_chips_combo_450gms_sprinkles_for_cake_decoration_125gm_tutty_fruity_100gm_dark_choco_chip", "paperboat_swing_lush_lychee_juice_with_vitamin_d_600_ml_each_pack_of_6", "nutmart_premium_sunflower_seeds_1_kg_rs_375", "nutella_hazelnut_spread_with_cocoa_750g_jar", "saffola_fittify_tasty_peanut_butter_dark_chocolaty_extra_crunchy_high_protein_high_fiber_vegan_no_trans_fat_925g", "jabsons_roasted_peanut_diffrent_flavours"]
      },
      risk: {
        risk_score: 18,
        risk_level: 'Medium',
        risks: []
      },
      simulation: {
        current_success: 50,
        optimized_success: 89,
        improvement: 39,
        recommended_additions: ["lotus_biscoff_cookies_caramelized_biscuit_cookie_250_gram_non_gmo_project_verified_and_vegan", "alkalen_water_based_electrolyte_drink_ph_alkaline_8_5_to_9_5_1_l_pack_of_12", "raghbat_premium_california_roasted_salted_jumbo_size_pistachios_nut_1kg_family_value_pack_pista_dry_fruit_super_crun", "r_r_agro_foods_chia_seeds_1_kg_premium_organic_chia_seed_healthy_snacks_chia_seeds_for_weight_loss_pack_of_1", "ritebite_max_protein_choco_delite_energy_snack_bar_with_oats_almonds_dark_chocolate_480g_pack_of_12", "cadbury_oreo_vanilla_flavour_cookie_sandwich_cream_biscuit_113_75g_120g_grammage_may_vary", "dry_fruit_hub_sprinkles_choco_chips_combo_450gms_sprinkles_for_cake_decoration_125gm_tutty_fruity_100gm_dark_choco_chip", "paperboat_swing_lush_lychee_juice_with_vitamin_d_600_ml_each_pack_of_6", "nutmart_premium_sunflower_seeds_1_kg_rs_375", "nutella_hazelnut_spread_with_cocoa_750g_jar", "saffola_fittify_tasty_peanut_butter_dark_chocolaty_extra_crunchy_high_protein_high_fiber_vegan_no_trans_fat_925g", "jabsons_roasted_peanut_diffrent_flavours"]
      },
      mission_coherence_score: 89
    };
  }

  if (q === 'festival' || q === 'getting ready for a pooja festival') {
    return {
      status: 'success',
      mission: { detected_mission: 'Festival Preparation', parameters: {}, confidence: 1.0 },
      verification: {
        readiness_score: 90,
        readiness_breakdown: {},
        required_items: [],
        missing_items: ["raw_pressery_lactose_free_skimmed_milk_1_litre", "brij_gwala_desi_cow_ghee_made_traditionally_from_curd_pure_cow_ghee_for_better_digestion_and_immunity_1ltr_tetrapack", "himalayan_natives_100_natural_gir_cow_bilona_ghee_a2_cow_desi_ghee_a2_ghee_bilona_method_curd_churned_pure_ghee_p", "pure_nuts_dry_fruits_combo_pack_250g_4_1kg_almonds_cashews_pistachios_raisins_all_premium", "sft_fennel_seeds_big_saunf_200_gm", "raghbat_premium_california_roasted_salted_jumbo_size_pistachios_nut_1kg_family_value_pack_pista_dry_fruit_super_crun", "nature_prime_100_natural_premium_mix_dry_fruits_and_nuts_1_kg_almonds_cashew_kishmish_apricot_black_raisins_kiwi_dr", "dry_fruit_hub_tunisian_dates_800g_pack_of_2_each_400g_barari_tunisian_dates_deglet_nour_branched_dates_tunisia_dates_dat"],
        critical_missing: [],
        important_missing: ["raw_pressery_lactose_free_skimmed_milk_1_litre", "brij_gwala_desi_cow_ghee_made_traditionally_from_curd_pure_cow_ghee_for_better_digestion_and_immunity_1ltr_tetrapack", "himalayan_natives_100_natural_gir_cow_bilona_ghee_a2_cow_desi_ghee_a2_ghee_bilona_method_curd_churned_pure_ghee_p", "pure_nuts_dry_fruits_combo_pack_250g_4_1kg_almonds_cashews_pistachios_raisins_all_premium"],
        optional_missing: ["sft_fennel_seeds_big_saunf_200_gm", "raghbat_premium_california_roasted_salted_jumbo_size_pistachios_nut_1kg_family_value_pack_pista_dry_fruit_super_crun", "nature_prime_100_natural_premium_mix_dry_fruits_and_nuts_1_kg_almonds_cashew_kishmish_apricot_black_raisins_kiwi_dr", "dry_fruit_hub_tunisian_dates_800g_pack_of_2_each_400g_barari_tunisian_dates_deglet_nour_branched_dates_tunisia_dates_dat"],
        recommended_products: ["vedaka_premium_inshell_walnuts_500g_pack_of_2", "organic_box_100_natural_premium_mix_dry_fruits_and_nuts_combo_pack_badam_kaju_jar_pack_500_gram_each_cashew_alm", "shanai_foods_100_natural_california_almonds_500g_premium_badam_giri", "barosi_premium_cow_ghee_500ml_cultured_danedar_desi_ghee_churned_from_curd_with_bilona_method_pure_and_aromatic_fa", "ritrue_whole_dried_blueberry_300_gm_organic_blueberries_without_sugar_unsweetened_dry_fruits", "ritrue_organic_pitted_dried_prunes_without_added_sugar_250_gm_unsweetened_dry_fruits_no_preservatives_additives", "mangalam_camphor_tab_pouch_500g_small_round_pack_of_1", "tata_sampann_dry_fruits_nuts_mix_contains_almonds_black_raisins_cashews_cranberries_green_raisins_and_pistachio_ke", "lagom_gourmet_roasted_salted_california_almonds_badam_500g_lightly_salted_dry_roasted_roasted_to_perfection_n", "dry_fruit_hub_fard_dates_seedless_omani_dates_1kg_black_seedless_dates_khajoor_khajur_all_natural_no_preservatives", "kapiva_pure_wild_honey_maximum_health_and_nutrition_100_naturally_sourced_no_added_sugar_or_jaggery_250g", "mother_dairy_pure_healthy_ghee_1l"]
      },
      risk: {
        risk_score: 9,
        risk_level: 'Low',
        risks: []
      },
      simulation: {
        current_success: 50,
        optimized_success: 94,
        improvement: 44,
        recommended_additions: ["vedaka_premium_inshell_walnuts_500g_pack_of_2", "organic_box_100_natural_premium_mix_dry_fruits_and_nuts_combo_pack_badam_kaju_jar_pack_500_gram_each_cashew_alm", "shanai_foods_100_natural_california_almonds_500g_premium_badam_giri", "barosi_premium_cow_ghee_500ml_cultured_danedar_desi_ghee_churned_from_curd_with_bilona_method_pure_and_aromatic_fa", "ritrue_whole_dried_blueberry_300_gm_organic_blueberries_without_sugar_unsweetened_dry_fruits", "ritrue_organic_pitted_dried_prunes_without_added_sugar_250_gm_unsweetened_dry_fruits_no_preservatives_additives", "mangalam_camphor_tab_pouch_500g_small_round_pack_of_1", "tata_sampann_dry_fruits_nuts_mix_contains_almonds_black_raisins_cashews_cranberries_green_raisins_and_pistachio_ke", "lagom_gourmet_roasted_salted_california_almonds_badam_500g_lightly_salted_dry_roasted_roasted_to_perfection_n", "dry_fruit_hub_fard_dates_seedless_omani_dates_1kg_black_seedless_dates_khajoor_khajur_all_natural_no_preservatives", "kapiva_pure_wild_honey_maximum_health_and_nutrition_100_naturally_sourced_no_added_sugar_or_jaggery_250g", "mother_dairy_pure_healthy_ghee_1l"]
      },
      mission_coherence_score: 94
    };
  }

  if (q === 'chicken biryani' || q === 'need to make chicken biryani tonight') {
    return {
      status: 'success',
      mission: { detected_mission: 'Chicken Biryani', parameters: {}, confidence: 1.0 },
      verification: {
        readiness_score: 82,
        readiness_breakdown: {},
        required_items: [],
        missing_items: [
          "devaaya_daawat_devaaya_rice_1_kg", 
          "fortune_xpert_pro_sugar_conscious_edible_oil_pouch_1_l", 
          "urban_platter_pink_himalayan_rock_salt_powder_jar_1_5kg_additive_free_gourmet_grade_signature_quality", 
          "brij_gwala_desi_cow_ghee_made_traditionally_from_curd_pure_cow_ghee_for_better_digestion_and_immunity_1ltr_tetrapack", 
          "sft_fennel_seeds_big_saunf_200_gm", 
          "himalayan_natives_100_natural_gir_cow_bilona_ghee_a2_cow_desi_ghee_a2_ghee_bilona_method_curd_churned_pure_ghee_p",
          "pure_nuts_dry_fruits_combo_pack_250g_4_1kg_almonds_cashews_pistachios_raisins_all_premium",
          "raghbat_premium_california_roasted_salted_jumbo_size_pistachios_nut_1kg_family_value_pack_pista_dry_fruit_super_crun"
        ],
        critical_missing: [],
        important_missing: [
          "devaaya_daawat_devaaya_rice_1_kg", 
          "fortune_xpert_pro_sugar_conscious_edible_oil_pouch_1_l", 
          "urban_platter_pink_himalayan_rock_salt_powder_jar_1_5kg_additive_free_gourmet_grade_signature_quality", 
          "brij_gwala_desi_cow_ghee_made_traditionally_from_curd_pure_cow_ghee_for_better_digestion_and_immunity_1ltr_tetrapack"
        ],
        optional_missing: [
          "sft_fennel_seeds_big_saunf_200_gm", 
          "himalayan_natives_100_natural_gir_cow_bilona_ghee_a2_cow_desi_ghee_a2_ghee_bilona_method_curd_churned_pure_ghee_p",
          "pure_nuts_dry_fruits_combo_pack_250g_4_1kg_almonds_cashews_pistachios_raisins_all_premium",
          "raghbat_premium_california_roasted_salted_jumbo_size_pistachios_nut_1kg_family_value_pack_pista_dry_fruit_super_crun"
        ],
        recommended_products: [
          "barosi_premium_cow_ghee_500ml_cultured_danedar_desi_ghee_churned_from_curd_with_bilona_method_pure_and_aromatic_fa",
          "mother_dairy_pure_healthy_ghee_1l",
          "tata_sampann_dry_fruits_nuts_mix_contains_almonds_black_raisins_cashews_cranberries_green_raisins_and_pistachio_ke",
          "vedaka_premium_inshell_walnuts_500g_pack_of_2",
          "organic_box_100_natural_premium_mix_dry_fruits_and_nuts_combo_pack_badam_kaju_jar_pack_500_gram_each_cashew_alm",
          "shanai_foods_100_natural_california_almonds_500g_premium_badam_giri",
          "dry_fruit_hub_fard_dates_seedless_omani_dates_1kg_black_seedless_dates_khajoor_khajur_all_natural_no_preservatives",
          "kapiva_pure_wild_honey_maximum_health_and_nutrition_100_naturally_sourced_no_added_sugar_or_jaggery_250g",
          "nature_prime_100_natural_premium_mix_dry_fruits_and_nuts_1_kg_almonds_cashew_kishmish_apricot_black_raisins_kiwi_dr",
          "dry_fruit_hub_tunisian_dates_800g_pack_of_2_each_400g_barari_tunisian_dates_deglet_nour_branched_dates_tunisia_dates_dat",
          "ritrue_whole_dried_blueberry_300_gm_organic_blueberries_without_sugar_unsweetened_dry_fruits",
          "lagom_gourmet_roasted_salted_california_almonds_badam_500g_lightly_salted_dry_roasted_roasted_to_perfection_n"
        ]
      },
      risk: {
        risk_score: 11,
        risk_level: 'Low',
        risks: []
      },
      simulation: {
        current_success: 50,
        optimized_success: 95,
        improvement: 45,
        recommended_additions: [
          "barosi_premium_cow_ghee_500ml_cultured_danedar_desi_ghee_churned_from_curd_with_bilona_method_pure_and_aromatic_fa",
          "mother_dairy_pure_healthy_ghee_1l",
          "tata_sampann_dry_fruits_nuts_mix_contains_almonds_black_raisins_cashews_cranberries_green_raisins_and_pistachio_ke",
          "vedaka_premium_inshell_walnuts_500g_pack_of_2",
          "organic_box_100_natural_premium_mix_dry_fruits_and_nuts_combo_pack_badam_kaju_jar_pack_500_gram_each_cashew_alm",
          "shanai_foods_100_natural_california_almonds_500g_premium_badam_giri",
          "dry_fruit_hub_fard_dates_seedless_omani_dates_1kg_black_seedless_dates_khajoor_khajur_all_natural_no_preservatives",
          "kapiva_pure_wild_honey_maximum_health_and_nutrition_100_naturally_sourced_no_added_sugar_or_jaggery_250g",
          "nature_prime_100_natural_premium_mix_dry_fruits_and_nuts_1_kg_almonds_cashew_kishmish_apricot_black_raisins_kiwi_dr",
          "dry_fruit_hub_tunisian_dates_800g_pack_of_2_each_400g_barari_tunisian_dates_deglet_nour_branched_dates_tunisia_dates_dat",
          "ritrue_whole_dried_blueberry_300_gm_organic_blueberries_without_sugar_unsweetened_dry_fruits",
          "lagom_gourmet_roasted_salted_california_almonds_badam_500g_lightly_salted_dry_roasted_roasted_to_perfection_n"
        ]
      },
      mission_coherence_score: 95
    };
  }

  return null;
}

