// =============================================================
// VISHVA FOODS — Stripe API routes
// POST /api/stripe/create-payment-intent
// POST /api/stripe/webhook   (raw body — mounted in index.ts)
// Uses automatic_payment_methods so Apple Pay / Google Pay / Link
// appear automatically in the Payment Element.
// =============================================================
import express, { type Request, type Response } from "express";
import { getStripe } from "../lib/stripeClient.js";
import { finalizePaidOrder } from "../lib/orders.js";

const router = express.Router();

interface CreateIntentBody {
  amount: number; // dollars
  email: string;
  name: string;
  orderId: string;
}

router.post("/create-payment-intent", async (req: Request, res: Response) => {
  const stripe = getStripe();
  if (!stripe) {
    return res.status(503).json({ error: "Payments not configured (missing STRIPE_SECRET_KEY)" });
  }
  try {
    const { amount, email, name, orderId } = req.body as CreateIntentBody;
    if (!amount || !email || !name || !orderId) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      receipt_email: email,
      description: `Vishva Foods order ${orderId}`,
      metadata: { orderId, customerName: name, customerEmail: email },
    });
    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Stripe create-intent error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to create payment intent",
    });
  }
});

// NOTE: this handler expects a RAW body. It is mounted with
// express.raw() in index.ts BEFORE the global json parser.
export async function stripeWebhookHandler(req: Request, res: Response) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
  if (!stripe || !webhookSecret) {
    return res.status(503).send("Webhook not configured");
  }
  const sig = req.headers["stripe-signature"] as string;
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return res.status(400).send("Webhook Error: invalid signature");
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const pi = event.data.object as any;
        const orderId = pi.metadata?.orderId;
        if (orderId) {
          await finalizePaidOrder(orderId, pi.id);
          console.log(`Finalized paid order ${orderId}`);
        }
        break;
      }
      case "payment_intent.payment_failed": {
        const pi = event.data.object as any;
        console.log(`Payment failed: ${pi.id}`);
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    // Return 200 so Stripe doesn't infinitely retry on our internal errors;
    // the /confirm fallback will reconcile.
  }

  res.json({ received: true });
}

export default router;
