import {
  corsHeaders,
  createAdminClient,
  errorResponse,
  jsonResponse,
} from "../_shared/reset-helpers.ts";

// Catalogue de prix AUTORITAIRE (côté serveur), en CENTIMES d'euro — identique à create-checkout-session.
// Le prix en dinars (DZD) est calculé automatiquement : DZD = EUR × 28 (règle fixée par le coach).
// Les montants envoyés par le client ne sont JAMAIS utilisés (anti-fraude).
const PRODUCT_CATALOG: Record<string, { name: string; amount: number }> = {
  "fat-loss-program": { name: "Programme Perte de gras", amount: 4900 },
  "mass-gain-plan": { name: "Plan Prise de masse", amount: 3900 },
  "coaching-pack": { name: "Pack coaching transformation", amount: 9900 },
  "ebook-strength": { name: "Ebook Force et technique", amount: 1900 },
  "hiit-burn": { name: "Programme HIIT brûle-graisse", amount: 2900 },
  "powerlifting-plan": { name: "Plan Powerlifting force max", amount: 4500 },
  "nutrition-advanced": { name: "Ebook Nutrition avancée", amount: 2500 },
  "competition-prep": { name: "Pack Préparation compétition", amount: 14900 },
  "full-body-4w": { name: "Programme Full Body 4 semaines", amount: 3500 },
  "shred-8w": { name: "Programme Shred 8 semaines", amount: 5900 },
  "mobility-plan": { name: "Plan Mobilité & Souplesse", amount: 2200 },
  "meal-prep-guide": { name: "Guide Meal Prep", amount: 1800 },
  "home-workout": { name: "Programme Maison sans matériel", amount: 2700 },
  "ebook-recovery": { name: "Ebook Récupération & Sommeil", amount: 1500 },
  "elite-coaching": { name: "Coaching Élite 1-à-1", amount: 19900 },
  // Programmes de TEST ajoutés pour essayer le paiement.
  "discovery-program": { name: "Programme Découverte", amount: 900 },
  "express-abs": { name: "Programme Abdos Express", amount: 1200 },
  "cardio-blast": { name: "Programme Cardio Blast", amount: 1500 },
};

// Taux fixe EUR -> DZD (le coach Hicham fixe le prix en dinars = prix € × 28).
const EUR_TO_DZD = 28;

// Convertit un montant en centimes d'euro vers un montant en dinars ENTIERS (DZD).
function eurCentsToDzd(amountCents: number): number {
  return Math.round((amountCents / 100) * EUR_TO_DZD);
}

function getChargilyBaseUrl(): string {
  return (Deno.env.get("CHARGILY_BASE_URL") || "https://pay.chargily.net/test/api/v2")
    .trim()
    .replace(/\/+$/, "");
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (request.method !== "POST") {
    return errorResponse(405, "METHOD_NOT_ALLOWED", "Méthode non autorisée.");
  }

  try {
    const apiKey = Deno.env.get("CHARGILY_API_SECRET");
    if (!apiKey) {
      return errorResponse(500, "CHARGILY_CONFIG_MISSING", "Clé Chargily manquante côté serveur.");
    }

    // Auth : on exige une session valide (comme les autres fonctions du projet).
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
    const user = userData.user;

    const body = await request.json().catch(() => ({}));
    const requestedIds: string[] = Array.isArray(body?.items)
      ? body.items.filter((id: unknown) => typeof id === "string")
      : [];
    // Page de retour après paiement : "shop" (Boutique) ou "programs" (Mes programmes).
    const returnTo = body?.returnTo === "programs" ? "programs" : "shop";

    // On ne garde que les produits PAYANTS connus du catalogue serveur.
    const uniqueIds = Array.from(new Set(requestedIds)).filter((id) => PRODUCT_CATALOG[id]);
    if (!uniqueIds.length) {
      return errorResponse(400, "NO_VALID_ITEMS", "Aucun produit payant valide dans le panier.");
    }

    const appUrl = (
      request.headers.get("origin") ||
      Deno.env.get("APP_URL") ||
      Deno.env.get("SITE_URL") ||
      ""
    )
      .trim()
      .replace(/\/+$/, "");
    if (!appUrl) {
      return errorResponse(500, "APP_URL_MISSING", "URL de l'application manquante.");
    }

    // Montant total en dinars (DZD), calculé depuis le catalogue € × 28.
    const amountCentsEur = uniqueIds.reduce((sum, id) => sum + PRODUCT_CATALOG[id].amount, 0);
    const amountDzd = eurCentsToDzd(amountCentsEur);
    if (amountDzd < 50) {
      // Chargily impose un montant minimum (~50 DZD).
      return errorResponse(400, "AMOUNT_TOO_LOW", "Montant trop faible pour un paiement CCP.");
    }

    const description = uniqueIds
      .map((id) => PRODUCT_CATALOG[id].name)
      .join(", ")
      .slice(0, 250);

    const successUrl = `${appUrl}/dashboard?view=${returnTo}&chargily=success`;
    const failureUrl = `${appUrl}/dashboard?view=${returnTo}&chargily=cancel`;

    // Création du checkout Chargily Pay v2.
    const chargilyResponse = await fetch(`${getChargilyBaseUrl()}/checkouts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amountDzd,
        currency: "dzd",
        success_url: successUrl,
        failure_url: failureUrl,
        locale: "fr",
        description: `Hicham Fit App — ${description}`,
        // Metadata récupérée à la vérification (source de vérité pour le déblocage).
        metadata: [{ user_id: user.id, product_ids: uniqueIds.join(",") }],
      }),
    });

    const chargilyData = await chargilyResponse.json().catch(() => ({}));
    if (!chargilyResponse.ok || !chargilyData?.checkout_url) {
      console.error("chargily create error", chargilyResponse.status, chargilyData);
      const reason = chargilyData?.message || chargilyData?.error || `HTTP ${chargilyResponse.status}`;
      return errorResponse(502, "CHARGILY_CREATE_FAILED", `Impossible de créer le paiement CCP : ${reason}`);
    }

    return jsonResponse({
      success: true,
      url: chargilyData.checkout_url,
      checkoutId: chargilyData.id,
      amountDzd,
    });
  } catch (error) {
    console.error("create-chargily-checkout error", error);
    return errorResponse(
      500,
      "CHARGILY_CREATE_FAILED",
      `Impossible de créer le paiement CCP : ${error?.message || String(error)}`,
    );
  }
});
