import type { ApiEnvelope, PaginatedEnvelope } from "./api";

/** A shop order, mirroring the backend `toOrderDTO`. Amounts are pesewas. */
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "READY"
  | "COLLECTED"
  | "CANCELLED";

export type OrderPaymentStatus = "UNPAID" | "PARTIAL" | "PAID";

export interface IOrderItem {
  id: string;
  productId: string | null;
  name: string;
  unit: string;
  unitAmount: number;
  quantity: number;
  lineTotal: number;
}

export interface IOrder {
  id: string;
  code: string;
  customerId?: string;
  fullName: string;
  phone: string;
  email: string | null;
  status: OrderStatus;
  source: "PUBLIC" | "ADMIN";
  paymentStatus: OrderPaymentStatus;
  currency: string;
  subtotal: number;
  total: number;
  amountPaid: number;
  balance: number;
  pickupDate: string | null;
  note: string | null;
  confirmedAt: string | null;
  processingAt: string | null;
  readyAt: string | null;
  collectedAt: string | null;
  cancelledAt: string | null;
  items: IOrderItem[];
  createdAt: string;
  updatedAt: string;
}

export type IOrderResponse = ApiEnvelope<IOrder>;

export type IOrderListResponse = PaginatedEnvelope<IOrder>;

/** POST /orders response - code + optional Paystack redirect. */
export type IPlaceOrderResponse = ApiEnvelope<{
  code: string;
  order: IOrder;
  authorizationUrl?: string;
}>;

/** Mirrors the backend `placeOrderSchema` (order-validation.ts). */
export interface IPlaceOrderInput {
  fullName: string;
  phone: string;
  email?: string;
  items: { productId: string; quantity: number }[];
  pickupDate?: string;
  note?: string;
  payNow?: boolean;
  /** Honeypot - must stay empty. */
  website?: string;
  /** Cloudflare Turnstile token; required by the backend when Turnstile is on. */
  turnstileToken?: string;
}

export interface IOrderListQuery {
  page?: number;
  limit?: number;
  /** Only orders containing a line for this product. */
  productId?: string;
  status?: OrderStatus;
  paymentStatus?: OrderPaymentStatus;
  customerId?: string;
  search?: string;
  /** Inclusive created-at date range (ISO strings); backend coerces to dates. */
  from?: string;
  to?: string;
}
