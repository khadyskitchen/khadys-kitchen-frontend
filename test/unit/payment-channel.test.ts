import { describe, expect, it } from "vitest";

import {
  methodLabel,
  paymentChannelDetail,
  paymentChannelLabel,
  paymentIssuer,
} from "@/lib/payment-channel";
import type { IPayment } from "@/types/application.types";

/** A settled payment with no instrument captured - the shape every field
 * defaults to, so each test only states what it actually cares about. */
const payment = (over: Partial<IPayment> = {}): IPayment => ({
  amount: 30000,
  cardType: null,
  channel: null,
  channelBank: null,
  channelBrand: null,
  channelLast4: null,
  createdAt: "2026-08-14T12:47:27.000Z",
  currency: "GHS",
  id: "p1",
  method: "PAYSTACK",
  note: null,
  paidAt: "2026-08-14T12:49:07.000Z",
  receiptNumber: null,
  reference: "KKPAY-TEST",
  reversedAt: null,
  status: "SUCCESS",
  ...over,
});

describe("paymentChannelLabel", () => {
  it("names the mobile money network rather than just the channel", () => {
    expect(
      paymentChannelLabel(
        payment({ channel: "mobile_money", channelBank: "MTN" }),
      ),
    ).toBe("MTN MoMo");
    expect(
      paymentChannelLabel(
        payment({ channel: "mobile_money", channelBank: "AirtelTigo" }),
      ),
    ).toBe("AirtelTigo MoMo");
  });

  // Vodafone Ghana trades as Telecel, but Paystack's API still says "Vodafone".
  // Staff reconcile against the Paystack dashboard, so the label carries both
  // rather than making anyone translate between two screens.
  it("renders Vodafone under its current name without losing the old one", () => {
    expect(
      paymentChannelLabel(
        payment({ channel: "mobile_money", channelBank: "Vodafone" }),
      ),
    ).toBe("Telecel (Vodafone) MoMo");
    expect(paymentIssuer(payment({ channelBank: "VOD" }))).toBe(
      "Telecel (Vodafone)",
    );
  });

  it("normalises inconsistent card brand casing", () => {
    expect(
      paymentChannelLabel(payment({ channel: "card", channelBrand: "visa" })),
    ).toBe("Visa card");
    expect(
      paymentChannelLabel(
        payment({ channel: "card", channelBrand: "Mastercard" }),
      ),
    ).toBe("Mastercard card");
  });

  it("labels the non-mobile-money channels", () => {
    expect(paymentChannelLabel(payment({ channel: "bank_transfer" }))).toBe(
      "Bank transfer",
    );
    expect(paymentChannelLabel(payment({ channel: "ussd" }))).toBe("USSD");
  });

  // Paystack adds channels; an unknown one must degrade to something readable
  // rather than leaking a raw enum into the console.
  it("humanises a channel it has never seen", () => {
    expect(paymentChannelLabel(payment({ channel: "apple_pay" }))).toBe(
      "Apple pay",
    );
  });

  // Manual counter payments never had an instrument, and neither did anything
  // settled before the ledger began capturing one.
  it("falls back to the payment method when no instrument was captured", () => {
    expect(paymentChannelLabel(payment({ method: "CASH" }))).toBe("Cash");
    expect(paymentChannelLabel(payment({ method: "BANK_TRANSFER" }))).toBe(
      "Bank transfer",
    );
    expect(paymentChannelLabel(payment())).toBe("Paystack");
  });

  it("falls back to mobile money when the network is unknown", () => {
    expect(paymentChannelLabel(payment({ channel: "mobile_money" }))).toBe(
      "Mobile money",
    );
  });
});

describe("paymentChannelDetail", () => {
  it("appends the masked tail when there is one", () => {
    expect(
      paymentChannelDetail(
        payment({
          channel: "mobile_money",
          channelBank: "MTN",
          channelLast4: "X8765",
        }),
      ),
    ).toBe("MTN MoMo · X8765");
  });

  it("omits the separator when there is no tail", () => {
    expect(paymentChannelDetail(payment({ method: "CASH" }))).toBe("Cash");
  });
});

describe("methodLabel", () => {
  it("spells out the ledger's own method enum", () => {
    expect(methodLabel("MOMO")).toBe("Mobile money");
    expect(methodLabel("BANK_TRANSFER")).toBe("Bank transfer");
    expect(methodLabel("PAYSTACK")).toBe("Paystack");
    expect(methodLabel("OTHER")).toBe("Other");
  });
});
