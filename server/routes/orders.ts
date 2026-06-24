// =============================================================
// VISHVA FOODS — Orders API routes
// POST /api/orders                 → create pending order (pre-payment)
// GET  /api/orders/:id             → fetch order (for confirm/track)
// POST /api/orders/:id/confirm     → idempotent finalize fallback
// GET  /api/admin/orders           → list (admin token)
// POST /api/admin/orders/:id/status→ update status (admin token)
// =============================================================
import express, { type Request, type Response } from "express";
import {
  createPendingOrder,
  getOrder,
  listOrders,
  updateOrderStatus,
  finalizePaidOrder,
} from "../lib/orders.js";
import { getStripe } from "../lib/stripeClient.js";
import { getSupabaseAdmin } from "../lib/supabaseAdmin.js";

const router = express.Router();

function requireAdmin(req: Request, res: Response): boolean {
  const token = req.headers["x-admin-token"];
  const expected = process.env.ADMIN_TOKEN;
  if (!expected || token !== expected) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}

router.post("/orders", async (req: Request, res: Response) => {
  try {
    const order = await createPendingOrder(req.body);
    res.json({ orderId: order.id, order });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ error: err instanceof Error ? err.message : "Failed to create order" });
  }
});

router.get("/orders/:id", async (req: Request, res: Response) => {
  try {
    const order = await getOrder(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Failed to fetch order" });
  }
});

// Fallback finalize: verify the PaymentIntent directly with Stripe, then
// finalize. Lets confirmation work without webhook forwarding in dev.
router.post("/orders/:id/confirm", async (req: Request, res: Response) => {
  try {
    const { paymentIntentId } = req.body || {};
    if (paymentIntentId) {
      const stripe = getStripe();
      if (stripe) {
        const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (pi.status !== "succeeded") {
          return res.status(409).json({ error: `Payment not completed (${pi.status})` });
        }
      }
    }
    const order = await finalizePaidOrder(req.params.id, paymentIntentId);
    res.json(order);
  } catch (err) {
    console.error("Confirm order error:", err);
    res.status(500).json({ error: err instanceof Error ? err.message : "Failed to confirm order" });
  }
});

router.get("/admin/orders", async (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return;
  try {
    const orders = await listOrders(100);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Failed to list orders" });
  }
});

router.post("/admin/orders/:id/status", async (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return;
  try {
    const { status } = req.body || {};
    const order = await updateOrderStatus(req.params.id, status);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Failed to update status" });
  }
});

// Toggle a menu item's availability (admin).
router.post("/admin/menu/:id/availability", async (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return;
  const db = getSupabaseAdmin();
  if (!db) return res.status(503).json({ error: "Database not configured" });
  try {
    const { available } = req.body || {};
    const { data, error } = await db
      .from("menu_items")
      .update({ available: Boolean(available), updated_at: new Date().toISOString() })
      .eq("id", req.params.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Failed to update item" });
  }
});

export default router;
