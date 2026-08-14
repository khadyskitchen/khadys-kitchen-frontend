/**
 * Single source of truth for status → pill colors across the app (admin
 * applications, orders, item status, etc.). Add new statuses here only.
 */
export interface StatusColor {
  bg: string;
  color: string;
}

const DEFAULT: StatusColor = { bg: "color-mix(in srgb, var(--color-accent) 12%, transparent)", color: "var(--color-accent)" };

const STATUS_COLORS: Record<string, StatusColor> = {
  // Applications
  NEW: { bg: "color-mix(in srgb, var(--color-accent) 12%, transparent)", color: "var(--color-accent)" },
  APPROVED: { bg: "color-mix(in srgb, var(--color-success) 12%, transparent)", color: "var(--color-success)" },
  WAITLIST: { bg: "rgba(176,124,32,0.15)", color: "#8A5F14" },
  REJECTED: { bg: "color-mix(in srgb, var(--color-danger) 10%, transparent)", color: "var(--color-danger)" },
  // Orders
  PENDING: { bg: "rgba(176,124,32,0.15)", color: "#8A5F14" },
  CONFIRMED: { bg: "rgba(92,107,69,0.15)", color: "#4A5838" },
  PROCESSING: { bg: "rgba(47,92,134,0.14)", color: "#2F5C86" },
  READY: { bg: "color-mix(in srgb, var(--color-success) 12%, transparent)", color: "var(--color-success)" },
  COLLECTED: { bg: "rgba(36,26,18,0.08)", color: "rgba(36,26,18,0.55)" },
  // Payments
  PAID: { bg: "color-mix(in srgb, var(--color-success) 12%, transparent)", color: "var(--color-success)" },
  PARTIAL: { bg: "rgba(176,124,32,0.15)", color: "#8A5F14" },
  UNPAID: { bg: "color-mix(in srgb, var(--color-danger) 10%, transparent)", color: "var(--color-danger)" },
  SUCCESS: { bg: "color-mix(in srgb, var(--color-success) 12%, transparent)", color: "var(--color-success)" },
  FAILED: { bg: "color-mix(in srgb, var(--color-danger) 10%, transparent)", color: "var(--color-danger)" },
  REVERSED: { bg: "rgba(36,26,18,0.08)", color: "rgba(36,26,18,0.55)" },
  // Application (backend enum)
  RECRUITED: { bg: "color-mix(in srgb, var(--color-success) 12%, transparent)", color: "var(--color-success)" },
  WAITLISTED: { bg: "rgba(176,124,32,0.15)", color: "#8A5F14" },
  WITHDRAWN: { bg: "rgba(36,26,18,0.08)", color: "rgba(36,26,18,0.55)" },
  // Shop orders
  CANCELLED: { bg: "color-mix(in srgb, var(--color-danger) 10%, transparent)", color: "var(--color-danger)" },
  // Training lifecycle
  DRAFT: { bg: "rgba(36,26,18,0.08)", color: "rgba(36,26,18,0.55)" },
  UPCOMING: { bg: "color-mix(in srgb, var(--color-accent) 12%, transparent)", color: "var(--color-accent)" },
  ONGOING: { bg: "color-mix(in srgb, var(--color-success) 12%, transparent)", color: "var(--color-success)" },
  COMPLETED: { bg: "rgba(36,26,18,0.08)", color: "rgba(36,26,18,0.55)" },
  PUBLISHED: { bg: "color-mix(in srgb, var(--color-success) 12%, transparent)", color: "var(--color-success)" },
  UNPUBLISHED: { bg: "rgba(36,26,18,0.08)", color: "rgba(36,26,18,0.55)" },
  // Training category (in-person vs online)
  IN_PERSON: { bg: "rgba(92,107,69,0.15)", color: "#4A5838" },
  ONLINE: { bg: "rgba(47,92,134,0.14)", color: "#2F5C86" },
  // Students / generic
  ACTIVE: { bg: "color-mix(in srgb, var(--color-success) 12%, transparent)", color: "var(--color-success)" },
  SUSPENDED: { bg: "color-mix(in srgb, var(--color-danger) 10%, transparent)", color: "var(--color-danger)" },
  ADMITTED: { bg: "color-mix(in srgb, var(--color-success) 12%, transparent)", color: "var(--color-success)" },
  ENROLLING: { bg: "color-mix(in srgb, var(--color-accent) 12%, transparent)", color: "var(--color-accent)" },
  GRADUATED: { bg: "color-mix(in srgb, var(--color-success) 12%, transparent)", color: "var(--color-success)" },
};

/** Look up the pill colors for a status label (case-insensitive). */
export function getStatusColor(status: string): StatusColor {
  return STATUS_COLORS[status.trim().toUpperCase()] ?? DEFAULT;
}
