import { apiSlice } from "../api-slice";
import type {
  IApplyInput,
  IApplyResponse,
  IVerifyResponse,
} from "@/types/application.types";

/**
 * Public application + payment endpoints. `createApplication` posts the form;
 * when `payNow` is set and a balance is owed the response carries a Paystack
 * `authorizationUrl` to redirect to. After Paystack redirects back, the verify
 * page confirms the payment by reference (the webhook also confirms it
 * server-side, so this is idempotent).
 */
export const applicationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createApplication: builder.mutation<IApplyResponse, IApplyInput>({
      query: (body) => ({ url: "applications", method: "POST", body }),
      invalidatesTags: ["Applications"],
    }),

    verifyPayment: builder.mutation<IVerifyResponse, { reference: string }>({
      query: (body) => ({ url: "payments/verify", method: "POST", body }),
    }),
  }),
});

export const { useCreateApplicationMutation, useVerifyPaymentMutation } =
  applicationsApi;
