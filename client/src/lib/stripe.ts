// =============================================================
// VISHVA FOODS — Stripe (client)
// One shared stripePromise loaded from the publishable key.
// stripeConfigured lets the UI show a clear setup message instead
// of a broken payment box when the key is absent.
// =============================================================
import { loadStripe, type Stripe } from "@stripe/stripe-js";

const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;

export const stripeConfigured = Boolean(key);
export const stripePromise: Promise<Stripe | null> | null = key ? loadStripe(key) : null;
