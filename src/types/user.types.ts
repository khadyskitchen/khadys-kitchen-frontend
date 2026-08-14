/**
 * The authenticated admin/staff user, mirroring the backend `User` model
 * (`prisma/schema.prisma`) - the safe, client-facing subset (never the
 * password or `tokenVersion`). Khady's Kitchen users are console operators,
 * not storefront customers.
 */
import type { ApiEnvelope, PaginatedEnvelope } from "./api";

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  STAFF = "STAFF",
}

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  profilePicture: string | null;
  role: UserRole;
  twoFactorEnabled: boolean;
}

/**
 * Standard success envelope carrying a single user. Mirrors the backend
 * `sendSuccess({ user })` shape exactly: `{ message, data: { user } }`
 * (login, 2FA verify/confirm/disable, refresh-token, and `/auth/me` all use it).
 */
export type IUserResponse = ApiEnvelope<{ user: IUser }>;

/** A console account as the admin/users endpoints return it (backend
 * `toPublicUser`) - the signed-in shape plus account-management fields. */
export interface ITeamUser extends IUser {
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Admin user endpoints return the user directly in `data` (no wrapper). */
export type ITeamUserResponse = ApiEnvelope<ITeamUser>;

export type ITeamUserListResponse = PaginatedEnvelope<ITeamUser>;

export interface ITeamUserListQuery {
  /** Created-date window, YYYY-MM-DD (inclusive). */
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
  role?: string;
  isActive?: boolean;
  search?: string;
}
