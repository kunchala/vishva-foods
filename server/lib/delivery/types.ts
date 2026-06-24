// =============================================================
// VISHVA FOODS — Delivery provider abstraction (types)
// One normalized interface so checkout doesn't care which courier
// network is behind it. Implementations: DoorDash Drive, Uber
// Direct, and a Mock provider for local dev without credentials.
// =============================================================

export type DeliveryProviderName = "doordash" | "uber" | "mock";

export interface QuoteInput {
  externalId: string;
  dropoff: {
    name: string;
    phone: string; // E.164, e.g. +17035550000
    address: string; // single-line formatted address
    city?: string;
    state?: string;
    zip?: string;
    instructions?: string;
  };
  orderValueCents: number;
  tipCents?: number;
}

export interface QuoteResult {
  provider: DeliveryProviderName;
  externalId: string;
  feeCents: number; // delivery fee in cents
  currency: string;
  etaMinutes: number | null;
  // Some providers (Uber) return an estimate/quote id needed at create time.
  quoteId?: string;
  raw?: unknown;
}

export interface CreateInput extends QuoteInput {
  quoteId?: string; // pass the id returned from quote() when required
}

export interface CreateResult {
  provider: DeliveryProviderName;
  externalId: string;
  deliveryId: string;
  trackingUrl: string | null;
  feeCents: number;
  status: string;
  raw?: unknown;
}

export interface StatusResult {
  status: string;
  trackingUrl: string | null;
  raw?: unknown;
}

export interface DeliveryProvider {
  name: DeliveryProviderName;
  quote(input: QuoteInput): Promise<QuoteResult>;
  createDelivery(input: CreateInput): Promise<CreateResult>;
  getStatus(deliveryId: string): Promise<StatusResult>;
}
