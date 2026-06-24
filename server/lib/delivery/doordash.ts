// =============================================================
// VISHVA FOODS — DoorDash Drive provider
// https://developer.doordash.com/en-US/docs/drive/
// Base: https://openapi.doordash.com/drive/v2
// Auth: short-lived JWT (see ddJwt.ts) as a Bearer token.
// =============================================================
import { createDoorDashJwt } from "../ddJwt.js";
import type {
  DeliveryProvider,
  QuoteInput,
  QuoteResult,
  CreateInput,
  CreateResult,
  StatusResult,
} from "./types.js";

const BASE = "https://openapi.doordash.com/drive/v2";

function env() {
  const developerId = process.env.DOORDASH_DEVELOPER_ID || "";
  const keyId = process.env.DOORDASH_KEY_ID || "";
  const signingSecret = process.env.DOORDASH_SIGNING_SECRET || "";
  if (!developerId || !keyId || !signingSecret) {
    throw new Error(
      "DoorDash credentials missing (DOORDASH_DEVELOPER_ID / DOORDASH_KEY_ID / DOORDASH_SIGNING_SECRET)"
    );
  }
  return { developerId, keyId, signingSecret };
}

function pickupFields() {
  return {
    pickup_address: process.env.RESTAURANT_PICKUP_ADDRESS || "",
    pickup_business_name: process.env.RESTAURANT_NAME || "Vishva Foods",
    pickup_phone_number: process.env.RESTAURANT_PHONE || "",
    pickup_instructions: process.env.RESTAURANT_PICKUP_INSTRUCTIONS || "",
  };
}

async function ddFetch(path: string, method: string, body?: unknown) {
  const { developerId, keyId, signingSecret } = env();
  const token = createDoorDashJwt({ developerId, keyId, signingSecret });
  const res = await fetch(`${BASE}${path}`, {
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
    const message =
      json?.message || json?.error || `DoorDash ${method} ${path} failed (${res.status})`;
    throw new Error(message);
  }
  return json;
}

export const doordashProvider: DeliveryProvider = {
  name: "doordash",

  async quote(input: QuoteInput): Promise<QuoteResult> {
    const body = {
      external_delivery_id: input.externalId,
      ...pickupFields(),
      dropoff_address: input.dropoff.address,
      dropoff_phone_number: input.dropoff.phone,
      dropoff_contact_given_name: input.dropoff.name,
      dropoff_instructions: input.dropoff.instructions || "",
      order_value: input.orderValueCents,
      tip: input.tipCents ?? 0,
    };
    const json = await ddFetch("/quotes", "POST", body);
    // dropoff_time_estimated is ISO; derive ETA minutes from now if present.
    let etaMinutes: number | null = null;
    if (json.dropoff_time_estimated) {
      const ms = new Date(json.dropoff_time_estimated).getTime() - Date.now();
      if (!Number.isNaN(ms)) etaMinutes = Math.max(1, Math.round(ms / 60000));
    } else if (typeof json.duration === "number") {
      etaMinutes = Math.round(json.duration / 60);
    }
    return {
      provider: "doordash",
      externalId: input.externalId,
      feeCents: json.fee ?? 0,
      currency: json.currency || "USD",
      etaMinutes,
      raw: json,
    };
  },

  async createDelivery(input: CreateInput): Promise<CreateResult> {
    const body = {
      external_delivery_id: input.externalId,
      ...pickupFields(),
      dropoff_address: input.dropoff.address,
      dropoff_phone_number: input.dropoff.phone,
      dropoff_contact_given_name: input.dropoff.name,
      dropoff_instructions: input.dropoff.instructions || "",
      order_value: input.orderValueCents,
      tip: input.tipCents ?? 0,
    };
    const json = await ddFetch("/deliveries", "POST", body);
    return {
      provider: "doordash",
      externalId: input.externalId,
      deliveryId: json.external_delivery_id || input.externalId,
      trackingUrl: json.tracking_url || null,
      feeCents: json.fee ?? 0,
      status: json.delivery_status || "created",
      raw: json,
    };
  },

  async getStatus(deliveryId: string): Promise<StatusResult> {
    const json = await ddFetch(`/deliveries/${encodeURIComponent(deliveryId)}`, "GET");
    return {
      status: json.delivery_status || "unknown",
      trackingUrl: json.tracking_url || null,
      raw: json,
    };
  },
};
