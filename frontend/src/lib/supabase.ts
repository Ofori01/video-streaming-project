import { createClient } from "@supabase/supabase-js";
import envConfig from "@/config/envConfig";

let supabaseClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  const { supabaseUrl, supabaseAnonKey } = envConfig;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
    );
  }

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseClient;
}
