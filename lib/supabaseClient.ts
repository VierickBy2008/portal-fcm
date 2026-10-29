import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cbtwoflmrbkxtpxzdsvu.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_XJ9kQc7W_iblon_DL65Ydw_adNBd...";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);