// =============================================================
// VISHVA FOODS — Delivery provider selector
// DELIVERY_PROVIDER=doordash | uber | mock  (default: mock)
// Mock is distance-free flat pricing so local dev works with no
// courier credentials. Swap the env var to go live.
// =============================================================
import type {
  DeliveryProvider,
  QuoteInput,
  QuoteResult,
  CreateInput,
  CreateResult,
  StatusResult,
} from "./types.js";
import { doordashProvider } from "./doordash.js";
import { uberProvider } from "./uber.js";

const mockProvider: DeliveryProvider = {
  name: "mock",
  async quote(input: QuoteInput): Promise<QuoteResult> {
    return {
      provider: "mock",
      externalId: input.externalId,
      feeCents: 499,
      currency: "USD",
      etaMinutes: 40,
      raw: { mock: true },
    };
  },
  async createDelivery(input: CreateInput): Promise<CreateResult> {
    return {
      provider: "mock",
      externalId: input.externalId,
      deliveryId: `mock_${input.externalId}`,
      trackingUrl: null,
      feeCents: 499,
      status: "created",
      raw: { mock: true },
    };
  },
  async getStatus(deliveryId: string): Promise<StatusResult> {
    return { status: "created", trackingUrl: null, raw: { mock: true, deliveryId } };
  },
};

export function getDeliveryProvider(): DeliveryProvider {
  const choice = (process.env.DELIVERY_PROVIDER || "mock").toLowerCase();
  switch (choice) {
    case "doordash":
      return doordashProvider;
    case "uber":
      return uberProvider;
    case "mock":
    default:
      return mockProvider;
  }
}

export type { DeliveryProvider, QuoteInput, QuoteResult, CreateInput, CreateResult, StatusResult };
