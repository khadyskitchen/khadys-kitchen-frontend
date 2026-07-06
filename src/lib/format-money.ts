/** Formats an amount in minor units (pesewas) as e.g. "GHS 2,000.00". */
export function formatMoney(minorUnits: number, currency = "GHS"): string {
  return `${currency} ${(minorUnits / 100).toLocaleString("en-GH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
