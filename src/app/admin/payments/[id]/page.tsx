"use client";

import Link from "next/link";
import { BackLink } from "@/components/admin/back-link";
import { PaymentDetailSkeleton } from "@/components/admin/detail-skeletons";
import { useParams } from "next/navigation";
import { Card } from "@/components/admin/ui";
import { useConfirm } from "@/components/admin/use-confirm";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { notify } from "@/lib/notify";
import { extractApiError } from "@/lib/extract-api-error";
import { formatMoney } from "@/lib/format-money";
import { methodLabel, paymentChannelLabel } from "@/lib/payment-channel";
import type { ILedgerPayment } from "@/types/payment.types";
import { formatDateTime } from "@/lib/format-date";
import { useAuthRole } from "@/hooks/use-auth-role";
import {
  useGetPaymentByIdQuery,
  useRefundPaymentMutation,
} from "@/redux/payments/payments-api";


function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 min-[480px]:flex-row min-[480px]:justify-between min-[480px]:gap-4 border-b border-ink/[0.08] py-3 last:border-0 min-[480px]:items-start">
      <span className="flex-none text-[13.5px] text-ink/55">{label}</span>
      <span className="min-w-0 text-[14.5px] font-medium text-ink [overflow-wrap:anywhere] min-[480px]:text-right">
        {children}
      </span>
    </div>
  );
}

/**
 * The identifiers Paystack returns that nobody needs day to day, but that are
 * the whole game during a support call or a dispute: what the provider said,
 * which authorization settled it, which customer profile it belongs to, and
 * where the payer was. Collapsed by default so the numbers that matter stay at
 * the top, and rendered only when there is something to show - a manual counter
 * payment has none of this and gets no empty disclosure.
 */
function ProviderDetails({ payment }: { payment: ILedgerPayment }) {
  const rows: { label: string; mono?: boolean; value: null | string }[] = [
    { label: "Provider response", value: payment.gatewayResponse },
    { label: "Authorization", mono: true, value: payment.authorizationCode },
    { label: "Paystack customer", mono: true, value: payment.customerCode },
    { label: "Payer IP", mono: true, value: payment.payerIp },
    { label: "Instrument country", value: payment.countryCode },
    {
      label: "Reusable",
      // Cards can be charged again, mobile money never can - worth stating
      // outright rather than leaving a bare boolean to be guessed at.
      value:
        payment.reusable === null
          ? null
          : payment.reusable
            ? "Yes - can be charged again"
            : "No - single use",
    },
  ].filter((r): r is { label: string; mono?: boolean; value: string } =>
    Boolean(r.value),
  );
  if (rows.length === 0) return null;

  return (
    <details className="mt-4 border-t border-ink/[0.08] pt-3">
      <summary className="cursor-pointer list-none text-[13.5px] font-semibold text-ink/55 transition-colors hover:text-accent">
        Provider details
      </summary>
      <div className="mt-1 grid">
        {rows.map((r) => (
          <Row key={r.label} label={r.label}>
            <span className={r.mono ? "font-mono text-[13px]" : undefined}>
              {r.value}
            </span>
          </Row>
        ))}
      </div>
    </details>
  );
}

/** The full record behind a ledger row: what it paid for, amounts, method,
 * and the paid/reversed dates - with the reverse action for admins. */
export default function PaymentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, error, refetch } =
    useGetPaymentByIdQuery(id);
  const [refund, { isLoading: reversing }] = useRefundPaymentMutation();
  const { isAdmin } = useAuthRole();
  const { confirm, dialog } = useConfirm();

  const payment = data?.data;

  if (isLoading) {
    return (
      <div>
        <BackLink href="/admin/payments">
          ← All payments
        </BackLink>
        <PaymentDetailSkeleton />
      </div>
    );
  }
  if (isError || !payment) {
    return (
      <div style={{ animation: "kk-rise .5s both" }}>
        <ErrorState error={error} onRetry={() => void refetch()} />
        <BackLink href="/admin/payments" className="mt-3">
          ← All payments
        </BackLink>
      </div>
    );
  }

  const doRefund = async () => {
    try {
      await refund({
        paymentId: payment.id,
        orderId: payment.order?.id,
        applicationId: payment.application?.id,
      }).unwrap();
      notify.success("Payment reversed");
    } catch (err) {
      notify.error("Couldn't reverse", {
        description: extractApiError(err).message,
      });
    }
  };

  return (
    <div style={{ animation: "kk-rise .5s both" }} className="max-w-[640px]">
      <BackLink href="/admin/payments">
        ← All payments
      </BackLink>

      <div className="mb-5 min-w-0">
        {/* break-words + a viewport-scaled size keep a huge figure (e.g.
            GHS 908,383,393.90) on-screen instead of overflowing the page. */}
        <h1 className="break-words font-serif text-[clamp(22px,7vw,36px)] font-normal">
          {formatMoney(payment.amount, payment.currency)}
        </h1>
        <div className="mt-1 break-all text-[13.5px] text-ink/55">
          {payment.reference}
        </div>
      </div>

      <Card className="p-[clamp(20px,3vw,28px)]">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-serif text-[19px]">Payment</h2>
          <div className="flex items-center gap-3">
            <StatusBadge status={payment.status} />
            {isAdmin && payment.status === "SUCCESS" ? (
              <Button
                variant="danger"
                size="sm"
                isLoading={reversing}
                loadingText="Reversing…"
                onClick={() =>
                  confirm({
                    title: "Reverse this payment?",
                    description:
                      "Paystack payments are refunded via Paystack; cash/MoMo are marked reversed. The owning order or application is re-credited.",
                    confirmText: "Reverse payment",
                    isDestructive: true,
                    onConfirm: doRefund,
                  })
                }
              >
                Reverse
              </Button>
            ) : null}
          </div>
        </div>

        <div className="grid">
          <Row label="For">
            {payment.order ? (
              <Link
                href={`/admin/orders/${payment.order.id}`}
                className="font-semibold text-accent"
              >
                Order {payment.order.code} · {payment.order.fullName}
              </Link>
            ) : payment.application ? (
              <Link
                href={`/admin/applications/${payment.application.id}`}
                className="font-semibold text-accent"
              >
                {payment.application.code} · {payment.application.fullName} ·{" "}
                {payment.application.trainingName}
              </Link>
            ) : (
              "-"
            )}
          </Row>
          <Row label="Paid with">
            {paymentChannelLabel(payment)}
            {/* Paystack masks both ends and never sends the middle, so
                "055XXX ··· X8765" is the whole instrument we are allowed to
                hold - enough for a payer to recognise their own number. */}
            {payment.channelBin ?? payment.channelLast4 ? (
              <span className="ml-1.5 tabular-nums text-ink/50">
                {[payment.channelBin, payment.channelLast4]
                  .filter(Boolean)
                  .join(" ··· ")}
              </span>
            ) : null}
            {/* e.g. "visa debit" - says whether a card pulled from a current
                account or a credit line, which the brand alone doesn't. */}
            {payment.cardType ? (
              <span className="ml-1.5 capitalize text-ink/50">
                ({payment.cardType})
              </span>
            ) : null}
          </Row>
          {/* The number that actually paid, which is regularly not the one on
              the order or application - a relative or a friend settles it. Kept
              visible so reconciling by phone doesn't dead-end. */}
          {payment.momoNumber ? (
            <Row label="Paid from">
              <span className="tabular-nums">{payment.momoNumber}</span>
            </Row>
          ) : null}
          {payment.accountName ? (
            <Row label="Account name">{payment.accountName}</Row>
          ) : null}
          {/* Bank transfers only: which of our accounts the money landed in. */}
          {payment.receiverBank ? (
            <Row label="Received into">
              {payment.receiverBank}
              {payment.receiverBankAccountNumber ? (
                <span className="ml-1.5 tabular-nums text-ink/50">
                  {payment.receiverBankAccountNumber}
                </span>
              ) : null}
            </Row>
          ) : null}
          {/* Only worth showing when it adds something the channel line didn't:
              on a manual entry the method IS the whole story and appears above. */}
          {payment.channel ? (
            <Row label="Method">{methodLabel(payment.method)}</Row>
          ) : null}
          <Row label="Paid">{formatDateTime(payment.paidAt ?? null)}</Row>
          {payment.reversedAt ? (
            <Row label="Reversed">{formatDateTime(payment.reversedAt)}</Row>
          ) : null}
          <Row label="Recorded">{formatDateTime(payment.createdAt)}</Row>
          {payment.receiptNumber ? (
            <Row label="Paystack receipt">
              <span className="tabular-nums">{payment.receiptNumber}</span>
            </Row>
          ) : null}
          {/* Only meaningful once the charge settled: a fee on a PENDING or
              REVERSED row would read as money taken that wasn't. */}
          {payment.fee !== null && payment.status === "SUCCESS" ? (
            <>
              <Row label="Paystack fee">
                −{formatMoney(payment.fee, payment.currency)}
              </Row>
              <Row label="Net settled">
                {formatMoney(payment.amount - payment.fee, payment.currency)}
              </Row>
            </>
          ) : null}
          {/* A provider response that is NOT the routine "Approved" is the
              first thing to look at, so it stays on the main card rather than
              inside the collapsed block below. */}
          {payment.gatewayResponse &&
          payment.gatewayResponse !== "Approved" ? (
            <Row label="Provider response">{payment.gatewayResponse}</Row>
          ) : null}
          {payment.note ? <Row label="Note">{payment.note}</Row> : null}
        </div>

        <ProviderDetails payment={payment} />
      </Card>
      {dialog}
    </div>
  );
}
