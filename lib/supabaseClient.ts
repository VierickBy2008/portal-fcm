import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cbtwoflmrbkxtpxzdsvu.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNidHdvZmxtcmJreHRweHpkc3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyMzE2MzksImV4cCI6MjEwODgwNzYzOX0.VjU4I44gUlXSjayzK12eTOnygM1xOA_635rPca1Tl-o";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
