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
  message?: string;
  /** When true (and a balance is owed), the backend returns a Paystack URL. */
  payNow?: boolean;
}

export interface IApplication {
  id: string;
  code: string;
  fullName: string;
  phone: string;
  email: string | null;
  location: string | null;
  needsHostel: boolean;
  amountDue: number;
  amountPaid: number;
  balance: number;
  currency: string;
  paymentStatus: "PAID" | "PARTIAL" | "UNPAID";
  status: string;
  createdAt: string;
}

/** `POST /applications` — application created; `authorizationUrl` present when paying now. */
export interface IApplyResponse {
  message: string;
  data: {
    application: IApplication;
    authorizationUrl?: string;
    code: string;
  };
}

export interface IPayment {
  id: string;
  amount: number;
  currency: string;
  method: string;
  status: "PENDING" | "SUCCESS" | "FAILED" | "REVERSED";
  reference: string;
  paidAt: string | null;
}

/** `POST /payments/verify`. */
export interface IVerifyResponse {
  message: string;
  data: IPayment;
}
