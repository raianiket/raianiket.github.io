import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://bbsgwqtkrvqbumueavkr.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_QERLt2jP8SKt8gHzFuGgfg_uoJogL1o";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
