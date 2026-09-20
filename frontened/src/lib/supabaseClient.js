import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const hasPlaceholderKey =
  !supabaseAnonKey ||
  supabaseAnonKey.includes("replace-with-your") ||
  supabaseAnonKey.includes("paste-your");

if (!supabaseUrl || hasPlaceholderKey) {
  // Fails loudly in dev rather than silently breaking auth calls later.
  console.error(
    "Invalid Supabase frontend configuration. Set VITE_SUPABASE_URL and " +
      "the project's anon public key in frontened/.env, then restart Vite."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
