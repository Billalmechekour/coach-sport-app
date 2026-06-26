// Standalone version of client-reviews Edge Function
// Paste this entire file in the Supabase Dashboard editor for client-reviews.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
  });
}

function errorResponse(status: number, code: string, message: string) {
  return jsonResponse({ success: false, error: { code, message } }, status);
}

function createAdminClient() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey =
    Deno.env.get("SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("MISSING_ENV");
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function normalizeAction(value: unknown) {
  const action = String(value || "list").trim().toLowerCase();
  return ["list", "save", "delete"].includes(action) ? action : "list";
}

function normalizeMessage(value: unknown) {
  return String(value || "").trim().slice(0, 200);
}

function normalizeRating(value: unknown) {
  return Math.max(0, Math.min(5, Math.round(Number(value) || 0)));
}

function getProfileName(profile: Record<string, unknown> | null | undefined) {
  const first = String(profile?.first_name || "").trim();
  const last = String(profile?.last_name || "").trim();
  return (first + " " + last).trim();
}

function serializeReview(row: Record<string, unknown>) {
  const profile =
    row.profiles && typeof row.profiles === "object"
      ? (row.profiles as Record<string, unknown>)
      : null;
  const profileName = getProfileName(profile);
  const profileAvatar = String(profile?.avatar_url || "").trim();
  return {
    id: String(row.id || ""),
    author_id: String(row.user_id || ""),
    author_name: profileName || String(row.author_name || "").trim() || "Athlète",
    avatar_url: profileAvatar || String(row.avatar_url || "").trim(),
    rating: Number(row.rating || 0),
    message: String(row.message || ""),
    created_at: String(row.updated_at || row.created_at || new Date().toISOString()),
  };
}

const reviewFields =
  "id, user_id, rating, message, author_name, avatar_url, created_at, updated_at, profiles ( first_name, last_name, avatar_url )";

async function getAuthenticatedUser(
  request: Request,
  supabase: ReturnType<typeof createAdminClient>,
) {
  const authorization = request.headers.get("Authorization") || "";
  const accessToken = authorization.replace(/^Bearer\s+/i, "").trim();
  if (!accessToken) throw new Error("AUTH_REQUIRED");
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user?.id) throw new Error("AUTH_REQUIRED");
  return data.user;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (request.method !== "POST") {
    return errorResponse(405, "METHOD_NOT_ALLOWED", "Méthode non autorisée.");
  }

  try {
    const payload = await request.json().catch(() => ({}));
    const action = normalizeAction(payload.action);
    const supabase = createAdminClient();

    if (action === "list") {
      const { data, error } = await supabase
        .from("client_reviews")
        .select(reviewFields)
        .order("updated_at", { ascending: false })
        .limit(100);
      if (error) {
        console.error("list error", error);
        return errorResponse(500, "REVIEWS_LIST_FAILED", "Impossible de charger les avis.");
      }
      return jsonResponse({
        success: true,
        reviews: (data || []).map((row) => serializeReview(row as Record<string, unknown>)),
      });
    }

    const user = await getAuthenticatedUser(request, supabase);

    if (action === "delete") {
      const { error } = await supabase.from("client_reviews").delete().eq("user_id", user.id);
      if (error) {
        console.error("delete error", error);
        return errorResponse(500, "REVIEW_DELETE_FAILED", "Impossible de supprimer l'avis.");
      }
      return jsonResponse({ success: true, deleted: true });
    }

    const message = normalizeMessage(payload.message);
    const rating = normalizeRating(payload.rating);
    if (!message || message.length < 10 || message.length > 200 || rating < 1 || rating > 5) {
      return errorResponse(400, "REVIEW_INVALID", "Avis invalide.");
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name,last_name,avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    const authorName =
      getProfileName(profile as Record<string, unknown> | null) ||
      String(user.user_metadata?.full_name || "").trim() ||
      user.email ||
      "Athlète";
    const avatarUrl =
      String((profile as Record<string, unknown> | null)?.avatar_url || "").trim() ||
      String(user.user_metadata?.avatar_url || "").trim();

    const { data, error } = await supabase
      .from("client_reviews")
      .upsert(
        {
          user_id: user.id,
          rating,
          message,
          author_name: authorName,
          avatar_url: avatarUrl,
        },
        { onConflict: "user_id" },
      )
      .select(reviewFields)
      .single();

    if (error || !data) {
      console.error("save error", error);
      return errorResponse(500, "REVIEW_SAVE_FAILED", "Impossible d'enregistrer l'avis.");
    }

    return jsonResponse({
      success: true,
      review: serializeReview(data as Record<string, unknown>),
    });
  } catch (error) {
    console.error("unexpected error", error);
    const message = String(error instanceof Error ? error.message : error);
    if (message === "AUTH_REQUIRED") {
      return errorResponse(401, "AUTH_REQUIRED", "Connecte-toi à ton compte pour partager ton avis.");
    }
    if (message === "MISSING_ENV") {
      return errorResponse(500, "SERVER_CONFIG_MISSING", "Configuration serveur manquante (SERVICE_ROLE_KEY).");
    }
    return errorResponse(500, "UNEXPECTED_ERROR", "Erreur inattendue.");
  }
});
