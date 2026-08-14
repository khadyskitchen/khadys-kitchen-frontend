// All formatters pin the bakery's timezone (Ghana = UTC) so the server render
// and any visitor's browser agree on the calendar day - otherwise an evening
// UTC timestamp shifts a day for non-UTC visitors and hydration flickers.
const TIME_ZONE = "Africa/Accra";

/** Formats an ISO date string as e.g. "12 Aug 2026" (- when absent/invalid). */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: TIME_ZONE,
  });
}

/** Date + time, e.g. "12 Aug 2026, 10:30". */
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TIME_ZONE,
  });
}

/** Time only, e.g. "10:30". */
export function formatTime(iso: string | null | undefined): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleTimeString("en-GH", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TIME_ZONE,
  });
}
