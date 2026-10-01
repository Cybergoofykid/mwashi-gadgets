const supabaseConfigured =
    window.MWASHI_SUPABASE_URL &&
    !window.MWASHI_SUPABASE_URL.includes("YOUR_") &&
    window.MWASHI_SUPABASE_ANON_KEY &&
    !window.MWASHI_SUPABASE_ANON_KEY.includes("YOUR_");

const supabaseClient = supabaseConfigured
    ? window.supabase.createClient(
        window.MWASHI_SUPABASE_URL,
        window.MWASHI_SUPABASE_ANON_KEY
      )
    : null;

function requireSupabase() {
    if (!supabaseClient) {
        throw new Error("Supabase is not configured. Open admin/config.js and add your Project URL and public anon key.");
    }
    return supabaseClient;
}
