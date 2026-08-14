/**
 * Central cache-tag registry for the RTK Query slice. Every query declares the
 * tags it `providesTags`; every mutation declares the tags it `invalidatesTags`.
 * Keeping the names here (as a `const` tuple) means tags can't drift and the tag
 * union is inferred by `createApi`.
 *
 * Auth carries no tags (session state lives in the auth slice + `resetApiState`);
 * the resource tags below are consumed by the admin feature slices.
 */
export const apiSliceTags = [
  "User",
  "Users",
  "Order",
  "Orders",
  "Training",
  "Trainings",
  "Application",
  "Applications",
  "Student",
  "Students",
  "Payments",
  "AuditLogs",
  "Product",
  "Products",
  "Customer",
  "Customers",
  "DashboardStats",
  "About",
  "GalleryImage",
  "GalleryImages",
] as const;

export type ApiTag = (typeof apiSliceTags)[number];

/** Standard success envelope every backend response uses (`{ message, data }`).
 * Mirrors the backend's `sendSuccess` (utils/http-response.ts). */
export interface ApiEnvelope<T> {
  message: string;
  data: T;
}

/** Pagination meta on every list response - mirrors the backend's
 * `sendPaginated` (utils/http-response.ts). */
export interface IPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** List envelope (`{ message, data, meta }`) - mirrors `sendPaginated`. Named
 * response types alias these envelopes instead of re-spelling the shape. */
export type PaginatedEnvelope<T> = ApiEnvelope<T[]> & {
  meta: IPaginationMeta;
};
