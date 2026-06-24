// =============================================================
// VISHVA FOODS — Uber Direct provider
// https://developer.uber.com/docs/deliveries/
// Auth: OAuth2 client_credentials (scope eats.deliveries).
// Base: https://api.uber.com/v1/customers/{customer_id}
// =============================================================
import type {
  DeliveryProvider,
  QuoteInput,
  QuoteResult,
  CreateInput,
  CreateResult,
  StatusResult,
} from "./types.js";

const TOKEN_URL = "https://auth.uber.com/oauth/v2/token";
const API_BASE = "https://api.uber.com/v1";

function env() {
  const clientId = process.env.UBER_DIRECT_CLIENT_ID || "";
  const clientSecret = process.env.UBER_DIRECT_CLIENT_SECRET || "";
  const customerId = process.env.UBER_DIRECT_CUSTOMER_ID || "";
  if (!clientId || !clientSecret || !customerId) {
    throw new Error(
      "Uber Direct credentials missing (UBER_DIRECT_CLIENT_ID / UBER_DIRECT_CLIENT_SECRET / UBER_DIRECT_CUSTOMER_ID)"
    );
  }
  return { clientId, clientSecret, customerId };
}

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.token;
  }
  const { clientId, clientSecret } = env();
  const form = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "client_credentials",
    scope: "eats.deliveries",
  });
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });
  if (!res.ok) {
    throw new Error(`Uber OAuth failed (${res.status})`);
  }
  const json: any = await res.json();
  cachedToken = {
    token: json.access_token,
    expiresAt: Date.now() + (json.expires_in ?? 2592000) * 1000,
  };
  return cachedToken.token;
}

// Uber wants addresses as a JSON-encoded structured string.
function addressString(input: {
  address: string;
  city?: string;
  state?: string;
  zip?: string;
}): string {
  return JSON.stringify({
    street_address: [input.address],
    city: input.city || "",
    state: input.state || "",
    zip_code: input.zip || "",
    country: "US",
  });
}

function pickupAddressString(): string {
  return JSON.stringify({
    street_address: [process.env.RESTAURANT_PICKUP_ADDRESS || ""],
    city: process.env.RESTAURANT_CITY || "",
    state: process.env.RESTAURANT_STATE || "VA",
    zip_code: process.env.RESTAURANT_ZIP || "",
    country: "US",
  });
}

async function uberFetch(path: string, method: string, body?: unknown) {
  const token = await getToken();
  const { customerId } = env();
  const res = await fetch(`${API_BASE}/customers/${customerId}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json: any = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }
  if (!res.ok) {
    const message = json?.message || json?.code || `Uber ${method} ${path} failed (${res.status})`;
    throw new Error(message);
  }
  return json;
}

export const uberProvider: DeliveryProvider = {
  name: "uber",

  async quote(input: QuoteInput): Promise<QuoteResult> {
    const body = {
      pickup_address: pickupAddressString(),
      dropoff_address: addressString(input.dropoff),
      pickup_phone_number: process.env.RESTAURANT_PHONE || "",
      dropoff_phone_number: input.dropoff.phone,
      manifest_total_value: input.orderValueCents,
    };
    const json = await uberFetch("/delivery_quotes", "POST", body);
    let etaMinutes: number | null = null;
    if (json.dropoff_eta) etaMinutes = Math.round(json.dropoff_eta);
    else if (json.duration) etaMinutes = Math.round(json.duration);
    return {
      provider: "uber",
      externalId: input.externalId,
      feeCents: json.fee ?? 0,
      currency: json.currency || "USD",
      etaMinutes,
      quoteId: json.id,
      raw: json,
    };
  },

  async createDelivery(input: CreateInput): Promise<CreateResult> {
    const body: Record<string, unknown> = {
      pickup_address: pickupAddressString(),
      pickup_name: process.env.RESTAURANT_NAME || "Vishva Foods",
      pickup_phone_number: process.env.RESTAURANT_PHONE || "",
      dropoff_address: addressString(input.dropoff),
      dropoff_name: input.dropoff.name,
      dropoff_phone_number: input.dropoff.phone,
      dropoff_notes: input.dropoff.instructions || "",
      manifest_total_value: input.orderValueCents,
      tip: input.tipCents ?? 0,
      external_id: input.externalId,
    };
    if (input.quoteId) body.quote_id = input.quoteId;
    const json = await uberFetch("/deliveries", "POST", body);
    return {
      provider: "uber",
      externalId: input.externalId,
      deliveryId: json.id,
      trackingUrl: json.tracking_url || null,
      feeCents: json.fee ?? 0,
      status: json.status || "pending",
      raw: json,
    };
  },

  async getStatus(deliveryId: string): Promise<StatusResult> {
    const json = await uberFetch(`/deliveries/${encodeURIComponent(deliveryId)}`, "GET");
    return {
      status: json.status || "unknown",
      trackingUrl: json.tracking_url || null,
      raw: json,
    };
  },
};
