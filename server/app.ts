// =============================================================
// VISHVA FOODS — API app factory
// Builds the Express app with all API routes. Shared by:
//   - server/index.ts  (local dev + Render/Railway: also serves the SPA)
//   - api/index.ts      (Vercel serverless function: API only; Vercel
//                        serves the static SPA itself)
// Webhook raw-body route is registered BEFORE the JSON parser.
// =============================================================
import express from "express";
import stripeRouter, { stripeWebhookHandler } from "./routes/stripe.js";
import deliveryRouter from "./routes/delivery.js";
import ordersRouter from "./routes/orders.js";

export function createApiApp() {
  const app = express();

  // Stripe webhook needs the raw body for signature verification.
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    stripeWebhookHandler
  );

  app.use(express.json({ limit: "1mb" }));

  app.use("/api/stripe", stripeRouter);
  app.use("/api/delivery", deliveryRouter);
  app.use("/api", ordersRouter); // /api/orders, /api/admin/orders, ...

  app.get("/api/health", (_req, res) => {
    res.json({
      ok: true,
      stripe: Boolean(process.env.STRIPE_SECRET_KEY),
      supabase: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      deliveryProvider: process.env.DELIVERY_PROVIDER || "mock",
      email: Boolean(process.env.RESEND_API_KEY),
    });
  });

  return app;
}
