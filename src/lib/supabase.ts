import { createClient } from "@supabase/supabase-js";

// Falls back to the known-good values so the analytics client always
// constructs, even in an environment without .env.local (e.g. a fresh clone).
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bbsgwqtkrvqbumueavkr.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_QERLt2jP8SKt8gHzFuGgfg_uoJogL1o";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
