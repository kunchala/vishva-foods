// =============================================================
// VISHVA FOODS — Supabase Client (browser, anon key)
// Graceful: does NOT throw at import if env is missing, so the
// site still renders (menu falls back to static seed data).
// Order creation is NOT done here — it goes through the server
// (/api/orders) with the service-role key so guest checkout works
// under RLS. Reads (public menu) use the anon key.
// =============================================================
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!supabaseConfigured) {
  console.warn(
    "[Vishva] Supabase not configured (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). " +
      "Menu will use built-in seed data; checkout requires the server keys."
  );
}

export const supabase: SupabaseClient | null = supabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : null;

// ── Types ──
export interface MenuItem {
  id: string;
  category: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  spice_level: number;
  is_vegan: boolean;
  is_jain: boolean;
  is_gluten_free: boolean;
  available: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  delivery_fee: number;
  total: number;
  fulfillment_type: "pickup" | "delivery";
  delivery_address?: {
    address: string;
    city: string;
    zip: string;
    instructions?: string;
  };
  status: "received" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";
  paid?: boolean;
  stripe_payment_intent_id?: string;
  doordash_delivery_id?: string;
  delivery_provider?: string;
  tracking_url?: string | null;
  updated_at: string;
}

// ── Menu reads (anon key, public read policy) ──
export async function fetchMenuItems(): Promise<MenuItem[]> {
  if (!supabase) throw new Error("Supabase not configured");
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("category", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw new Error(`Failed to fetch menu items: ${error.message}`);
  return data || [];
}

// Fetch a single order by id (for confirm/track). Prefer the server
// route /api/orders/:id; this is a convenience for authed contexts.
export async function fetchOrder(orderId: string): Promise<Order | null> {
  const res = await fetch(`/api/orders/${orderId}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch order");
  return res.json();
}
