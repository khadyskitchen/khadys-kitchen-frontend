import { apiSlice } from "../api-slice";
import type { ApiEnvelope } from "@/types/api";
import { toQueryString } from "@/lib/to-query-string";
import type { IPayment, IRecordPaymentInput } from "@/types/application.types";
import type {
  IOrderListQuery,
  IOrderListResponse,
  IOrderResponse,
  IPlaceOrderInput,
  IPlaceOrderResponse,
} from "@/types/order.types";

/** Shop orders - the public guest checkout/tracking/pay surface and the admin
 * list/detail/lifecycle/payments surface. Amounts are pesewas. */
export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ── Public ────────────────────────────────────────────────
    placeOrder: builder.mutation<
      IPlaceOrderResponse,
      { body: IPlaceOrderInput; idempotencyKey?: string }
    >({
      query: ({ body, idempotencyKey }) => ({
        url: "orders",
        method: "POST",
        body,
        headers: idempotencyKey
          ? { "Idempotency-Key": idempotencyKey }
          : undefined,
      }),
      // "Products" refreshes stock in the public browser after checkout
      // decrements it. No "Orders" here: admin caches never exist in the
      // public browser session that places an order.
      invalidatesTags: ["Products"],
    }),

    trackOrder: builder.query<IOrderResponse, string>({
      query: (code) => ({ url: `orders/${code}`, method: "GET" }),
      providesTags: (_r, _e, code) => [{ type: "Order", id: code }],
    }),

    payOrderByCode: builder.mutation<
      ApiEnvelope<{ authorizationUrl: string; balance: number }>,
      { code: string; email?: string }
    >({
      query: ({ code, email }) => ({
        url: `orders/${code}/pay`,
        method: "POST",
        body: { email },
      }),
      // Drop the tracked order from cache so the balance re-reads fresh when
      // the customer returns from Paystack to the tracking page.
      invalidatesTags: (_r, _e, { code }) => [{ type: "Order", id: code }],
    }),

    // ── Admin ─────────────────────────────────────────────────
    getOrders: builder.query<IOrderListResponse, IOrderListQuery | void>({
      query: (params) => ({
        url: `admin/orders${toQueryString(params ?? {})}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Order" as const, id })),
              "Orders",
            ]
          : ["Orders"],
    }),

    getOrderById: builder.query<IOrderResponse, string>({
      query: (id) => ({ url: `admin/orders/${id}`, method: "GET" }),
      providesTags: (_r, _e, id) => [{ type: "Order", id }],
    }),

    /** Walk-in order recorded at the counter. */
    createOrder: builder.mutation<IOrderResponse, IPlaceOrderInput>({
      query: (body) => ({ url: "admin/orders", method: "POST", body }),
      // Customers: order counts / totals on the customer views are derived
      // from orders, so they change with every order-affecting mutation.
      invalidatesTags: (result) => [
        "Orders",
        "Products",
        "DashboardStats",
        "Customers",
        ...(result?.data.customerId
          ? [{ type: "Customer" as const, id: result.data.customerId }]
          : []),
      ],
    }),

    setOrderStatus: builder.mutation<
      IOrderResponse,
      {
        id: string;
        action: "confirm" | "process" | "ready" | "collect" | "cancel";
      }
    >({
      query: ({ id, action }) => ({
        url: `admin/orders/${id}/${action}`,
        method: "POST",
      }),
      invalidatesTags: (result, _e, { id }) => [
        { type: "Order", id },
        "Orders",
        "Products",
        "DashboardStats",
        "Customers",
        ...(result?.data.customerId
          ? [{ type: "Customer" as const, id: result.data.customerId }]
          : []),
      ],
    }),

    getOrderPayments: builder.query<
      ApiEnvelope<IPayment[]>,
      string
    >({
      query: (id) => ({ url: `admin/orders/${id}/payments`, method: "GET" }),
      providesTags: (_r, _e, id) => [{ type: "Order", id }, "Payments"],
    }),

    recordOrderPayment: builder.mutation<
      ApiEnvelope<IPayment>,
      { id: string; body: IRecordPaymentInput; idempotencyKey?: string }
    >({
      query: ({ id, body, idempotencyKey }) => ({
        url: `admin/orders/${id}/payments`,
        method: "POST",
        body,
        headers: idempotencyKey
          ? { "Idempotency-Key": idempotencyKey }
          : undefined,
      }),
      // "Customers": recorded money moves the customer's totalSpent.
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Order", id },
        "Orders",
        "Payments",
        "DashboardStats",
        "Customers",
      ],
    }),
  }),
});

export const {
  usePlaceOrderMutation,
  useTrackOrderQuery,
  usePayOrderByCodeMutation,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useSetOrderStatusMutation,
  useGetOrderPaymentsQuery,
  useRecordOrderPaymentMutation,
} = ordersApi;
