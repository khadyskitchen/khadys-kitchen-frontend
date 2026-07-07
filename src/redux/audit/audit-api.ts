import { apiSlice } from "../api-slice";
import { toQueryString } from "@/lib/to-query-string";
import type {
  IAuditListQuery,
  IAuditListResponse,
} from "@/types/audit.types";

/** Read-only audit trail. Every admin action is recorded server-side; this
 * surfaces it. It's tag-invalidated ("AuditLogs") like the rest of the cache;
 * to refetch on tab focus/reconnect, pass `refetchOnFocus`/`refetchOnReconnect`
 * at the `useGetAuditLogsQuery` call site (setupListeners is wired in the
 * store) — RTK Query has no per-endpoint switch for it. */
export const auditApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAuditLogs: builder.query<IAuditListResponse, IAuditListQuery | void>({
      query: (params) => ({
        url: `admin/audit-logs${toQueryString(params ?? {})}`,
        method: "GET",
      }),
      providesTags: ["AuditLogs"],
    }),
  }),
});

export const { useGetAuditLogsQuery } = auditApi;
