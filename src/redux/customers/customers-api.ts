import { apiSlice } from "../api-slice";
import { toQueryString } from "@/lib/to-query-string";
import type {
  ICustomerListQuery,
  ICustomerListResponse,
  ICustomerResponse,
} from "@/types/customer.types";

/** Shop customers — accrued automatically from checkouts (keyed by phone).
 * Admin browses history and keeps notes; there is nothing to create here. */
export const customersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<
      ICustomerListResponse,
      ICustomerListQuery | void
    >({
      query: (params) => ({
        url: `admin/customers${toQueryString(params ?? {})}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Customer" as const,
                id,
              })),
              "Customers",
            ]
          : ["Customers"],
    }),

    getCustomerById: builder.query<ICustomerResponse, string>({
      query: (id) => ({ url: `admin/customers/${id}`, method: "GET" }),
      providesTags: (_r, _e, id) => [{ type: "Customer", id }],
    }),

    updateCustomer: builder.mutation<
      ICustomerResponse,
      { id: string; body: { fullName?: string; email?: string | null; notes?: string | null } }
    >({
      query: ({ id, body }) => ({
        url: `admin/customers/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Customer", id },
        "Customers",
      ],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useUpdateCustomerMutation,
} = customersApi;
