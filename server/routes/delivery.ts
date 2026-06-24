// =============================================================
// VISHVA FOODS — Delivery API routes
// POST /api/delivery/quote   → fee + ETA before payment
// POST /api/delivery/status  → poll a dispatched delivery
// (Creation happens server-side after payment succeeds; see
//  orders route / Stripe webhook.)
// =============================================================
import express, { type Request, type Response } from "express";
import { getDeliveryProvider } from "../lib/delivery/index.js";

const router = express.Router();

router.post("/quote", async (req: Request, res: Response) => {
  try {
    const { externalId, dropoff, orderValueCents, tipCents } = req.body || {};
    if (!dropoff?.address || !dropoff?.phone || !orderValueCents) {
      return res.status(400).json({ error: "Missing dropoff address, phone, or order value" });
    }
    const provider = getDeliveryProvider();
    const quote = await provider.quote({
      externalId: externalId || `vf_${Date.now()}`,
      dropoff,
      orderValueCents,
      tipCents,
    });
    res.json(quote);
  } catch (err) {
    console.error("Delivery quote error:", err);
    res.status(502).json({
      error: err instanceof Error ? err.message : "Failed to get delivery quote",
    });
  }
});

router.post("/status", async (req: Request, res: Response) => {
  try {
    const { deliveryId } = req.body || {};
    if (!deliveryId) return res.status(400).json({ error: "Missing deliveryId" });
    const provider = getDeliveryProvider();
    const status = await provider.getStatus(deliveryId);
    res.json(status);
  } catch (err) {
    console.error("Delivery status error:", err);
    res.status(502).json({
      error: err instanceof Error ? err.message : "Failed to get delivery status",
    });
  }
});

export default router;
