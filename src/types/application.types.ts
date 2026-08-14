/**
 * Bake School applications + the pay-now/pay-later flow, mirroring the backend
 * `apply` / payment contracts.
 */
export interface IApplyInput {
  trainingId: string;
  fullName: string;
  phone: string;
  email?: string;
  location?: string;
  needsHostel: boolean;
  /** Fee picks: one item per choice group plus any optional add-ons.
   * Mirrors the backend `applySchema.selectedFeeItemIds`. */
  selectedFeeItemIds?: string[];
  message?: string;
  /** Minor units paid at registration - part or full of the bill. Required
   * whenever the application owes anything; the backend returns the Paystack
   * URL for it. Mirrors `applySchema.payAmount`. */
  payAmount?: number;
  /** Cloudflare Turnstile token; required by the backend when Turnstile is on. */
  turnstileToken?: string;
}

/** Bake School application lifecycle - mirrors the backend `ApplicationStatus`
 * enum (schema.prisma). */
export type ApplicationStatus =
  | "PENDING"
  | "WAITLISTED"
  | "RECRUITED"
  | "REJECTED"
  | "WITHDRAWN";

/** Mirrors the backend `ApplicationPaymentStatus` enum (schema.prisma). */
export type ApplicationPaymentStatus = "PAID" | "PARTIAL" | "UNPAID";

/** The public application DTO (`GET /applications/:code`) - enough for the
 * status panel a receipt-code link renders. Lives here (not in lib/) so the
 * types layer never imports from lib and the status unions have exactly one
 * definition. */
export interface PublicApplication {
  code: string;
  fullName: string;
  email: string | null;
  status: ApplicationStatus;
  paymentStatus: ApplicationPaymentStatus;
  amountDue: number;
  amountPaid: number;
  balance: number;
  currency: string;
  createdAt: string;
  training?: { id: string; name: string; slug: string };
}

export interface IFeeLine {
  id: string;
  name: string;
  amount: number;
  kind: string;
}

export interface IApplication {
  id: string;
  code: string;
  fullName: string;
  phone: string;
  email: string | null;
  location: string | null;
  message?: string | null;
  needsHostel: boolean;
  amountDue: number;
  amountPaid: number;
  balance: number;
  currency: string;
  paymentStatus: ApplicationPaymentStatus;
  status: ApplicationStatus;
  source?: string;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
  // Present on the admin detail view.
  feeLines?: IFeeLine[];
  payments?: IPayment[];
  student?: { id: string; code: string; status: string } | null;
  training?: { id: string; name: string; slug: string };
}

export interface IApplicationListResponse {
  message: string;
  data: IApplication[];
  meta: import("./api").IPaginationMeta;
}

export interface IApplicationResponse {
  message: string;
  data: IApplication;
}

export interface IApplicationListQuery {
  /** Created-date window, YYYY-MM-DD (inclusive). */
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
  trainingId?: string;
  status?: ApplicationStatus;
  paymentStatus?: ApplicationPaymentStatus;
  search?: string;
}

/** `POST /applications` - application created; `authorizationUrl` present when paying now. */
export interface IApplyResponse {
  message: string;
  data: {
    application: IApplication;
    authorizationUrl?: string;
    code: string;
  };
}

/** Mirrors the backend `PaymentStatus` enum (schema.prisma). */
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REVERSED";

export interface IPayment {
  id: string;
  amount: number;
  currency: string;
  method: string;
  status: PaymentStatus;
  reference: string;
  paidAt: string | null;
  /** Set when a SUCCESS payment was later refunded/reversed. */
  reversedAt: string | null;
  createdAt: string;
  note: string | null;
}

/** `POST /payments/verify`. */
export interface IVerifyResponse {
  message: string;
  data: IPayment;
}

/** `POST /applications/lookup` - public status lookup. The receipt code alone
 * is not enough: the contact (email or phone) must match the registration.
 * Mirrors the backend `lookupApplicationSchema`. */
export interface ILookupApplicationInput {
  code: string;
  contact: string;
}

export interface ILookupApplicationResponse {
  message: string;
  data: PublicApplication;
}

/** `GET /admin/applications/:id/payments`. */
export interface IPaymentsListResponse {
  message: string;
  data: IPayment[];
}

export interface IRecordPaymentInput {
  amount: number;
  method: "CASH" | "MOMO" | "BANK_TRANSFER" | "OTHER";
  note?: string;
  paidAt?: string;
}
