import {
  corsHeaders,
  createAdminClient,
  errorResponse,
  jsonResponse,
} from "../_shared/reset-helpers.ts";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return errorResponse(405, "METHOD_NOT_ALLOWED", "Méthode non autorisée.");
  }

  try {
    const authorization = request.headers.get("Authorization") || "";
    const accessToken = authorization.replace(/^Bearer\s+/i, "").trim();

    if (!accessToken) {
      return errorResponse(401, "SESSION_REQUIRED", "Session requise.");
    }

    const supabase = createAdminClient();
    const { data: userData, error: userError } = await supabase.auth.getUser(accessToken);

    if (userError || !userData.user?.id) {
      return errorResponse(401, "SESSION_INVALID", "Session invalide.");
    }

    const { error: deleteError } = await supabase.auth.admin.deleteUser(userData.user.id);

    if (deleteError) {
      console.error("delete account error", deleteError);
      return errorResponse(500, "DELETE_ACCOUNT_FAILED", "Impossible de supprimer le compte.");
    }

    return jsonResponse({ success: true });
  } catch (error) {
    console.error("delete-account unexpected error", error);
    return errorResponse(500, "UNEXPECTED_ERROR", "Erreur inattendue.");
  }
});
