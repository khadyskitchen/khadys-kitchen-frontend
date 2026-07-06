import type { IPaginationMeta } from "./training.types";

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

export interface IAuditListResponse {
  message: string;
  data: IAuditLog[];
  meta: IPaginationMeta;
}

export interface IAuditListQuery {
  page?: number;
  limit?: number;
  action?: string;
  entity?: string;
  actorId?: string;
  entityId?: string;
}
