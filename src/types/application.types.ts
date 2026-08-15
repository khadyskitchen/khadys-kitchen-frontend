/**
 * Bake School applications + the full/part payment flow, mirroring the
 * backend `apply` / payment contracts.
 */
import type { ApiEnvelope, PaginatedEnvelope } from "./api";

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
  /** The applicant's own ledger. Present on the by-code lookup, which is what
   * lets the status panel tell "you haven't paid" apart from "your payment is
   * still settling" - the difference between a correct balance and asking
   * someone to pay twice. */
  payments?: IPayment[];
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

export type IApplicationListResponse = PaginatedEnvelope<IApplication>;

export type IApplicationResponse = ApiEnvelope<IApplication>;

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
export type IApplyResponse = ApiEnvelope<{
  application: IApplication;
  authorizationUrl?: string;
  code: string;
}>;

/** Mirrors the backend `PaymentStatus` enum (schema.prisma). */
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REVERSED";

/** Paystack channel strings, as the backend stores them verbatim. Widened with
 * `(string & {})` so an unrecognised channel Paystack adds later still types -
 * the display layer falls back to title-casing rather than the build breaking. */
export type PaymentChannel =
  | "bank"
  | "bank_transfer"
  | "card"
  | "eft"
  | "mobile_money"
  | "qr"
  | "ussd"
  | (string & {});

/** What the payer paid WITH, captured from Paystack at confirmation (backend
 * `PaymentInstrumentDTO`). All null for manual counter payments and for rows
 * settled before this was captured, so always render defensively. */
export interface IPaymentInstrument {
  /** mobile_money | card | bank | bank_transfer | ussd | qr | eft. */
  channel: PaymentChannel | null;
  /** Network ("MTN", "Vodafone", "AirtelTigo") or issuing bank, verbatim. */
  channelBank: string | null;
  /** Instrument brand, e.g. "Mtn", "visa". */
  channelBrand: string | null;
  /** Masked tail - a card's last4, or a MoMo number's "X8765". */
  channelLast4: string | null;
  /** Masked head - a card's BIN, or a MoMo number's prefix ("055XXX"). */
  channelBin: string | null;
  /** Instrument country as Paystack resolved it, e.g. "GH". */
  countryCode: string | null;
  /** "visa debit" and similar. Null on mobile money. */
  cardType: string | null;
  /** Paystack's receipt number, quoted by payers in support requests. */
  receiptNumber: string | null;
}

export interface IPayment extends IPaymentInstrument {
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

/** Console-only fields (backend `AdminPaymentDTO`) - provider fees and payer
 * identifiers, which the public surfaces deliberately never receive. */
export interface IAdminPayment extends IPayment {
  /** Card/account holder name, when the provider resolved one. */
  accountName: string | null;
  authorizationCode: string | null;
  customerCode: string | null;
  /** Provider fee in pesewas; net settled = amount - fee. */
  fee: number | null;
  /** Provider outcome text, e.g. "Approved". */
  gatewayResponse: string | null;
  /** The mobile money number that actually paid - often not the number on the
   * order or application, which is what makes it useful when reconciling. */
  momoNumber: string | null;
  payerIp: string | null;
  /** Bank transfer only: the account the money actually landed in. */
  receiverBank: string | null;
  receiverBankAccountNumber: string | null;
  /** Whether Paystack will let this authorization be charged again. */
  reusable: boolean | null;
}

/** `POST /payments/verify`. */
export type IVerifyResponse = ApiEnvelope<IPayment>;

/** `POST /applications/lookup` - public status lookup. The receipt code alone
 * is not enough: the contact (email or phone) must match the registration.
 * Mirrors the backend `lookupApplicationSchema`. */
export interface ILookupApplicationInput {
  code: string;
  contact: string;
}

export type ILookupApplicationResponse = ApiEnvelope<PublicApplication>;

/** `GET /admin/applications/:id/payments`. */
export type IPaymentsListResponse = ApiEnvelope<IPayment[]>;

export interface IRecordPaymentInput {
  amount: number;
  method: "CASH" | "MOMO" | "BANK_TRANSFER" | "OTHER";
  note?: string;
  paidAt?: string;
}
