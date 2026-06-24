// =============================================================
// VISHVA FOODS — Stripe client singleton (server)
// Returns null if STRIPE_SECRET_KEY is absent so the app degrades
// gracefully instead of throwing at import time.
// =============================================================
import Stripe from "stripe";

let stripe: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (stripe) return stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  // Pin to the SDK's default API version (omit explicit version to avoid drift).
  stripe = new Stripe(key);
  return stripe;
}
