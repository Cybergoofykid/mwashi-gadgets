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

/**
 * Verify that the currently signed-in Supabase user is an authorized
 * Mwashi Gadgets administrator.
 *
 * Authentication alone is NOT enough: the user's auth.users id must also
 * exist in public.admin_users.
 */
async function requireAdmin(options = {}) {
    const { redirect = true } = options;
    const sb = requireSupabase();

    try {
        const { data: sessionData, error: sessionError } =
            await sb.auth.getSession();

        if (sessionError || !sessionData?.session) {
            if (redirect) window.location.href = "login.html";
            return false;
        }

        const userId = sessionData.session.user.id;

        const { data: adminUser, error: adminError } = await sb
            .from("admin_users")
            .select("user_id")
            .eq("user_id", userId)
            .maybeSingle();

        if (adminError) {
            console.error("Admin authorization error:", adminError);
            if (redirect) window.location.href = "login.html";
            return false;
        }

        if (!adminUser) {
            console.warn("Signed-in user is not an authorized Mwashi Gadgets admin.");
            await sb.auth.signOut();
            if (redirect) window.location.href = "login.html?unauthorized=1";
            return false;
        }

        return true;
    } catch (error) {
        console.error("Admin authorization error:", error);
        if (redirect) window.location.href = "login.html";
        return false;
    }
}

