import { apiSlice } from "../api-slice";
import { toQueryString } from "@/lib/to-query-string";
import type {
  IAuditListQuery,
  IAuditListResponse,
} from "@/types/audit.types";

/** Read-only audit trail. Every admin action is recorded server-side; this
 * surfaces it. Refetches on focus so it stays reasonably fresh. */
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
