// =============================================================
// VISHVA FOODS — Orders core logic (server)
// Single source of truth for the money path. finalizePaidOrder()
// is idempotent and is called from BOTH the Stripe webhook and the
// /confirm fallback endpoint, so orders complete even if webhook
// forwarding isn't configured during local development.
// =============================================================
import { getSupabaseAdmin } from "./supabaseAdmin.js";
import { getDeliveryProvider } from "./delivery/index.js";
import { sendOrderConfirmationEmail } from "./email.js";

export interface OrderItemRow {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export interface CreateOrderInput {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: OrderItemRow[];
  subtotal: number;
  tax: number;
  delivery_fee: number;
  total: number;
  fulfillment_type: "pickup" | "delivery";
  delivery_address: {
    address: string;
    city?: string;
    state?: string;
    zip?: string;
    instructions?: string;
  } | null;
}

const NOT_CONFIGURED =
  "Database not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on the server.";

export async function createPendingOrder(input: CreateOrderInput) {
  const db = getSupabaseAdmin();
  if (!db) throw new Error(NOT_CONFIGURED);

  const { data, error } = await db
    .from("orders")
    .insert([
      {
        customer_name: input.customer_name,
        customer_email: input.customer_email,
        customer_phone: input.customer_phone,
        items: input.items,
        subtotal: input.subtotal,
        tax: input.tax,
        delivery_fee: input.delivery_fee,
        total: input.total,
        fulfillment_type: input.fulfillment_type,
        delivery_address: input.delivery_address,
        status: "received",
        paid: false,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(`Failed to create order: ${error.message}`);
  return data;
}

export async function getOrder(orderId: string) {
  const db = getSupabaseAdmin();
  if (!db) throw new Error(NOT_CONFIGURED);
  const { data, error } = await db.from("orders").select("*").eq("id", orderId).single();
  if (error && error.code !== "PGRST116") {
    throw new Error(`Failed to fetch order: ${error.message}`);
  }
  return data || null;
}

export async function listOrders(limit = 50) {
  const db = getSupabaseAdmin();
  if (!db) throw new Error(NOT_CONFIGURED);
  const { data, error } = await db
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(`Failed to list orders: ${error.message}`);
  return data || [];
}

export async function updateOrderStatus(orderId: string, status: string) {
  const db = getSupabaseAdmin();
  if (!db) throw new Error(NOT_CONFIGURED);
  const { data, error } = await db
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", orderId)
    .select()
    .single();
  if (error) throw new Error(`Failed to update order: ${error.message}`);
  await db.from("order_status_log").insert([{ order_id: orderId, status, note: "manual" }]);
  return data;
}

/**
 * Idempotently finalize a paid order:
 *  - marks paid + records the PaymentIntent id
 *  - dispatches a courier (delivery orders only)
 *  - sends the confirmation email
 * Safe to call multiple times; if already paid it no-ops.
 */
export async function finalizePaidOrder(orderId: string, paymentIntentId?: string) {
  const db = getSupabaseAdmin();
  if (!db) throw new Error(NOT_CONFIGURED);

  const order = await getOrder(orderId);
  if (!order) throw new Error(`Order ${orderId} not found`);
  if (order.paid) return order; // already finalized — idempotent

  const update: Record<string, unknown> = {
    paid: true,
    updated_at: new Date().toISOString(),
  };
  if (paymentIntentId) update.stripe_payment_intent_id = paymentIntentId;

  // Dispatch courier for delivery orders.
  if (order.fulfillment_type === "delivery" && order.delivery_address) {
    try {
      const provider = getDeliveryProvider();
      const created = await provider.createDelivery({
        externalId: `vf_${order.id}`,
        dropoff: {
          name: order.customer_name,
          phone: order.customer_phone,
          address: order.delivery_address.address,
          city: order.delivery_address.city,
          state: order.delivery_address.state,
          zip: order.delivery_address.zip,
          instructions: order.delivery_address.instructions,
        },
        orderValueCents: Math.round(Number(order.subtotal) * 100),
        tipCents: 0,
      });
      update.doordash_delivery_id = created.deliveryId;
      update.delivery_provider = created.provider;
      update.tracking_url = created.trackingUrl;
      update.status = "preparing";
    } catch (err) {
      // Don't fail the payment finalize if courier dispatch hiccups;
      // the order is still paid and the kitchen can dispatch manually.
      console.error("Courier dispatch failed (order still paid):", err);
    }
  }

  const { data, error } = await db
    .from("orders")
    .update(update)
    .eq("id", orderId)
    .select()
    .single();
  if (error) throw new Error(`Failed to finalize order: ${error.message}`);

  await db
    .from("order_status_log")
    .insert([{ order_id: orderId, status: "paid", note: paymentIntentId || "" }]);

  // Fire-and-forget the email; never block finalize on it.
  sendOrderConfirmationEmail(data).catch((e) =>
    console.error("Confirmation email failed:", e)
  );

  return data;
}
