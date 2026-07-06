import { apiSlice } from "../api-slice";
import type { ITraining, ITrainingListResponse } from "@/types/training.types";

/**
 * Public trainings, injected into the single `apiSlice`. The storefront only
 * ever shows the current class — the most recently published cohort — so
 * `getCurrentTraining` fetches the newest published training (the backend orders
 * `GET /trainings` newest-first) and returns it, or `null` when none is open.
 */
export const trainingsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentTraining: builder.query<ITraining | null, void>({
      query: () => ({ url: "trainings?limit=1", method: "GET" }),
      transformResponse: (res: ITrainingListResponse) => res.data[0] ?? null,
      providesTags: ["Trainings"],
    }),
  }),
});

export const { useGetCurrentTrainingQuery } = trainingsApi;
