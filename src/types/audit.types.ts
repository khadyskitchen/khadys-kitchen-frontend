import type { PaginatedEnvelope } from "./api";

/** An audit-log entry, mirroring the backend toAuditDTO. */
export interface IAuditLog {
  id: string;
  action: string;
  actor: { id: string; name: string; email: string } | null;
  entity: string;
  entityId: string | null;
  metadata: unknown;
  ip: string | null;
  createdAt: string;
}

export type IAuditListResponse = PaginatedEnvelope<IAuditLog>;

export interface IAuditListQuery {
  /** Created-date window, YYYY-MM-DD (inclusive). */
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
  action?: string;
  entity?: string;
  actorId?: string;
  entityId?: string;
}
