/**
 * Single source of truth for status → pill colors across the app (admin
 * applications, orders, item status, etc.). Add new statuses here only.
 */
export interface StatusColor {
  bg: string;
  color: string;
}

const DEFAULT: StatusColor = { bg: "rgba(194,24,91,0.12)", color: "#C2185B" };

const STATUS_COLORS: Record<string, StatusColor> = {
  // Applications
  NEW: { bg: "rgba(194,24,91,0.12)", color: "#C2185B" },
  APPROVED: { bg: "rgba(46,107,63,0.12)", color: "#2E6B3F" },
  WAITLIST: { bg: "rgba(176,124,32,0.15)", color: "#8A5F14" },
  REJECTED: { bg: "rgba(163,32,54,0.1)", color: "#A32036" },
  // Orders
  PENDING: { bg: "rgba(176,124,32,0.15)", color: "#8A5F14" },
  CONFIRMED: { bg: "rgba(92,107,69,0.15)", color: "#4A5838" },
  READY: { bg: "rgba(46,107,63,0.12)", color: "#2E6B3F" },
  COLLECTED: { bg: "rgba(36,26,18,0.08)", color: "rgba(36,26,18,0.55)" },
  // Items / generic
  ACTIVE: { bg: "rgba(46,107,63,0.12)", color: "#2E6B3F" },
  ADMITTED: { bg: "rgba(46,107,63,0.12)", color: "#2E6B3F" },
  ENROLLING: { bg: "rgba(194,24,91,0.12)", color: "#C2185B" },
  GRADUATED: { bg: "rgba(46,107,63,0.12)", color: "#2E6B3F" },
};

/** Look up the pill colors for a status label (case-insensitive). */
export function getStatusColor(status: string): StatusColor {
  return STATUS_COLORS[status.trim().toUpperCase()] ?? DEFAULT;
}
