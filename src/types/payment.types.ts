import type { IPayment } from "./application.types";
import type { IPaginationMeta } from "./training.types";

/** A row in the unified admin payments ledger (backend `toLedgerPaymentDTO`) —
 * every payment across shop orders and bake-school applications, with a
 * reference back to whichever record owns it. */
export interface ILedgerPayment extends IPayment {
  application: {
    id: string;
    code: string;
    fullName: string;
    trainingName: string;
  } | null;
  order: { id: string; code: string; fullName: string } | null;
}

export interface ILedgerListResponse {
  message: string;
  data: ILedgerPayment[];
  meta: IPaginationMeta;
}

export interface ILedgerListQuery {
  /** Created-date window, YYYY-MM-DD (inclusive). */
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
  status?: string;
  method?: string;
  /** Which ledger a payment belongs to. */
  owner?: "application" | "order";
  search?: string;
}
