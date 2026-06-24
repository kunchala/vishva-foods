// =============================================================
// VISHVA FOODS — Email API Routes
// POST /api/email/send-order-confirmation
// =============================================================
import express, { Request, Response } from "express";
import { Resend } from "resend";
import OrderConfirmationEmail from "../emails/OrderConfirmation";

const router = express.Router();

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendOrderConfirmationBody {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{ name: string; qty: number; price: number }>;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  fulfillmentType: "pickup" | "delivery";
  pickupAddress?: string;
  deliveryAddress?: string;
  estimatedTime: string;
}

// Send order confirmation email
router.post("/send-order-confirmation", async (req: Request, res: Response) => {
  try {
    const {
      orderId,
      customerName,
      customerEmail,
      items,
      subtotal,
      tax,
      deliveryFee,
      total,
      fulfillmentType,
      pickupAddress,
      deliveryAddress,
      estimatedTime,
    } = req.body as SendOrderConfirmationBody;

    if (!orderId || !customerEmail || !items) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Render email template
    const emailHtml = await OrderConfirmationEmail({
      orderId,
      customerName,
      items,
      subtotal,
      tax,
      deliveryFee,
      total,
      fulfillmentType,
      pickupAddress,
      deliveryAddress,
      estimatedTime,
    });

    // Send email via Resend
    const result = await resend.emails.send({
      from: "Vishva Foods <orders@vishvaindianfoods.com>",
      to: customerEmail,
      subject: `Order Confirmed - Vishva Foods #${orderId}`,
      react: emailHtml as any,
    });

    if (result.error) {
      console.error("Resend error:", result.error);
      return res.status(500).json({ error: result.error.message });
    }

    console.log(`✅ Order confirmation email sent to ${customerEmail}`);
    res.json({ success: true, messageId: result.data?.id });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to send email",
    });
  }
});

export default router;
