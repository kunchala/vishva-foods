// =============================================================
// VISHVA FOODS — Email sending (server)
// Wraps Resend + the React Email template. No-ops cleanly when
// RESEND_API_KEY is absent so dev/checkout never breaks on email.
// =============================================================
import { Resend } from "resend";
import OrderConfirmationEmail from "../emails/OrderConfirmation.js";

interface OrderRow {
  id: string;
  customer_name: string;
  customer_email: string;
  items: Array<{ name: string; qty: number; price: number }>;
  subtotal: number;
  tax: number;
  delivery_fee: number;
  total: number;
  fulfillment_type: "pickup" | "delivery";
  delivery_address: { address: string; city?: string; state?: string; zip?: string } | null;
  tracking_url?: string | null;
}

export async function sendOrderConfirmationEmail(order: OrderRow) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping confirmation email.");
    return;
  }
  const resend = new Resend(apiKey);
  const from = process.env.EMAIL_FROM || "Vishva Foods <orders@vishvaindianfoods.com>";

  const pickupAddress =
    order.fulfillment_type === "pickup"
      ? process.env.RESTAURANT_PICKUP_ADDRESS || "Address sent separately"
      : undefined;
  const deliveryAddress = order.delivery_address
    ? [order.delivery_address.address, order.delivery_address.city, order.delivery_address.zip]
        .filter(Boolean)
        .join(", ")
    : undefined;
  const estimatedTime =
    order.fulfillment_type === "pickup" ? "Ready in 25–35 min" : "Delivery in 35–50 min";

  const element = OrderConfirmationEmail({
    orderId: order.id,
    customerName: order.customer_name,
    items: order.items,
    subtotal: Number(order.subtotal),
    tax: Number(order.tax),
    deliveryFee: Number(order.delivery_fee),
    total: Number(order.total),
    fulfillmentType: order.fulfillment_type,
    pickupAddress,
    deliveryAddress,
    estimatedTime,
  });

  const result = await resend.emails.send({
    from,
    to: order.customer_email,
    subject: `Order confirmed — Vishva Foods #${order.id.slice(0, 8).toUpperCase()}`,
    react: element as any,
  });

  if (result.error) throw new Error(result.error.message);
  return result.data?.id;
}
