import { createClient } from "@supabase/supabase-js";

// Ensure these environment variables are set in your .env or platform deployment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://vvuhruravbcjqpwsukcp.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseAnonKey) {
  console.error("Missing VITE_SUPABASE_ANON_KEY environment variable. Supabase client will fail.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey || "MISSING_KEY");
