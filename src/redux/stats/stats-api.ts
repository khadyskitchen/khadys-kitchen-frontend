import { apiSlice } from "../api-slice";
import type { IDashboardStatsResponse } from "@/types/stats.types";

/** Admin dashboard numbers. Mutations that change money or orders invalidate
 * the DashboardStats tag so the overview stays honest. */
export const statsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<IDashboardStatsResponse, void>({
      query: () => ({ url: "admin/stats/dashboard", method: "GET" }),
      providesTags: ["DashboardStats"],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = statsApi;
