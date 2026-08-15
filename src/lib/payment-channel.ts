/**
 * Turning Paystack's raw instrument fields into something a human running a
 * bakery would recognise.
 *
 * The ledger stores what the provider said, verbatim and unhelpfully:
 * `channel: "mobile_money"`, `channelBank: "Vodafone"`, `channelLast4: "X8765"`.
 * All the renaming lives here, on purpose - if Paystack changes a label, or
 * Ghana's networks rebrand again, exactly one file moves.
 */
import type { IPayment, IPaymentInstrument } from "@/types/application.types";

/** Ghana's three mobile money networks, keyed by what Paystack calls them.
 *
 * Vodafone Ghana became Telecel in 2023 and Paystack's API still says
 * "Vodafone", so both are mapped. Customers know it as Telecel now, but a
 * staff member reconciling against the Paystack dashboard is reading
 * "Vodafone" there - so the label carries both rather than making anyone
 * translate between two screens. */
const MOMO_NETWORKS: Record<string, string> = {
  airteltigo: "AirtelTigo",
  atl: "AirtelTigo",
  mtn: "MTN",
  tcl: "Telecel",
  telecel: "Telecel",
  vod: "Telecel (Vodafone)",
  vodafone: "Telecel (Vodafone)",
};

/** Channels that aren't mobile money, in the wording the console should use. */
const CHANNEL_LABELS: Record<string, string> = {
  bank: "Bank",
  bank_transfer: "Bank transfer",
  card: "Card",
  eft: "EFT",
  mobile_money: "Mobile money",
  qr: "QR",
  ussd: "USSD",
};

/** Last-resort prettifier for a channel Paystack adds that we don't know yet -
 * "apple_pay" reads as "Apple pay" rather than leaking a raw enum. */
const humanise = (value: string): string =>
  value.replace(/[_-]+/g, " ").replace(/^./, (c) => c.toUpperCase());

/** The network or issuer, renamed for humans. Falls back to what Paystack sent. */
export function paymentIssuer(instrument: IPaymentInstrument): string | null {
  const bank = instrument.channelBank?.trim();
  if (!bank) return null;
  return MOMO_NETWORKS[bank.toLowerCase()] ?? bank;
}

/**
 * The short label for a list row, e.g. "MTN MoMo", "Telecel (Vodafone) MoMo",
 * "Visa card", "Bank transfer", "Cash".
 *
 * Falls back to the payment *method* when no instrument was captured: manual
 * counter payments never had one, and neither did anything settled before the
 * ledger started recording it, so "Paystack" remains an honest answer rather
 * than a blank cell.
 */
export function paymentChannelLabel(payment: IPayment): string {
  const { channel } = payment;
  if (!channel) return methodLabel(payment.method);

  const issuer = paymentIssuer(payment);

  if (channel === "mobile_money") {
    return issuer ? `${issuer} MoMo` : "Mobile money";
  }
  if (channel === "card") {
    // Paystack's brand casing is inconsistent ("visa", "Mastercard"), so
    // normalise rather than echo it.
    const brand = payment.channelBrand?.trim();
    return brand ? `${humanise(brand)} card` : "Card";
  }
  return CHANNEL_LABELS[channel] ?? humanise(channel);
}

/**
 * The label plus the masked instrument tail, for detail views where there's
 * room: "MTN MoMo · X8765". Paystack already masks these - `channelLast4` is
 * "X8765", never the full number - so nothing sensitive is being revealed by
 * showing it.
 */
export function paymentChannelDetail(payment: IPayment): string {
  const label = paymentChannelLabel(payment);
  const tail = payment.channelLast4?.trim();
  return tail ? `${label} · ${tail}` : label;
}

/** Human label for the stored payment *method* (the ledger's own enum). */
export function methodLabel(method: string): string {
  switch (method) {
    case "BANK_TRANSFER":
      return "Bank transfer";
    case "CASH":
      return "Cash";
    case "MOMO":
      return "Mobile money";
    case "PAYSTACK":
      return "Paystack";
    default:
      return humanise(method.toLowerCase());
  }
}

/** Channel filter options for the admin ledger toolbar.
 *
 * Every `value` must exist in the backend's `PAYMENT_CHANNELS` allowlist
 * (`src/validations/payment-validation.ts`) - that schema rejects anything else
 * with a 400. A subset is fine; an invented value is not. */
export const CHANNEL_FILTER_OPTIONS = [
  { label: "All channels", value: "all" },
  { label: "Mobile money", value: "mobile_money" },
  { label: "Card", value: "card" },
  { label: "Bank transfer", value: "bank_transfer" },
  { label: "Bank", value: "bank" },
  { label: "USSD", value: "ussd" },
] as const;
