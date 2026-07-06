import { apiSlice } from "../api-slice";
import { toQueryString } from "@/lib/to-query-string";
import type { IPayment } from "@/types/application.types";
import type {
  ILedgerListQuery,
  ILedgerListResponse,
} from "@/types/payment.types";

/** The unified admin payments ledger — every payment across shop orders and
 * bake-school applications, with owner references. */
export const paymentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query<ILedgerListResponse, ILedgerListQuery | void>({
      query: (params) => ({
        url: `admin/payments${toQueryString(params ?? {})}`,
        method: "GET",
      }),
      providesTags: ["Payments"],
    }),

    /** Owner-agnostic refund — invalidates broadly since the payment may
     * belong to either ledger (the applications slice has its own scoped one). */
    refundLedgerPayment: builder.mutation<
      { message: string; data: IPayment },
      { paymentId: string; reason?: string }
    >({
      query: ({ paymentId, reason }) => ({
        url: `admin/payments/${paymentId}/refund`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: [
        "Payments",
        "Orders",
        "Applications",
        "DashboardStats",
      ],
    }),
  }),
});

export const { useGetPaymentsQuery, useRefundLedgerPaymentMutation } =
  paymentsApi;
