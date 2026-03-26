import { createClient } from "@supabase/supabase-js";
import envConfig from "../../config/env.config";

export function getSupabaseServerClient() {
  const supabaseUrl = envConfig.SUPABASE_URL;
  const supabaseAnonKey = envConfig.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY.",
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
