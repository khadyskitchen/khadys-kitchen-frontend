import type { IAdminPayment, PaymentStatus } from "./application.types";
import type { PaginatedEnvelope } from "./api";

/** A row in the unified admin payments ledger (backend `toLedgerPaymentDTO`) -
 * every payment across shop orders and bake-school applications, with a
 * reference back to whichever record owns it. */
export interface ILedgerPayment extends IAdminPayment {
  application: {
    id: string;
    code: string;
    fullName: string;
    trainingName: string;
  } | null;
  order: { id: string; code: string; fullName: string } | null;
}

export type ILedgerListResponse = PaginatedEnvelope<ILedgerPayment>;

export interface ILedgerListQuery {
  /** Created-date window, YYYY-MM-DD (inclusive). */
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
  status?: PaymentStatus;
  method?: string;
  /** Paystack channel the money arrived by (mobile_money, card, bank_transfer…). */
  channel?: string;
  /** Which ledger a payment belongs to. */
  owner?: "application" | "order";
  search?: string;
}
