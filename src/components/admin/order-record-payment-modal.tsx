"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { TextField } from "@/components/ui/TextField";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { notify } from "@/lib/notify";
import { extractApiError } from "@/lib/extract-api-error";
import { useRecordOrderPaymentMutation } from "@/redux/orders/orders-api";
import type { IRecordPaymentInput } from "@/types/application.types";

const METHODS: IRecordPaymentInput["method"][] = [
  "CASH",
  "MOMO",
  "BANK_TRANSFER",
  "OTHER",
];

/** Admin modal to record an offline payment (cash / MoMo / bank) against a
 * shop order — for pay-at-pickup customers. Amount entered in GHS. */
export function OrderRecordPaymentModal({
  orderId,
  open,
  onClose,
}: {
  orderId: string;
  open: boolean;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<IRecordPaymentInput["method"]>("CASH");
  const [note, setNote] = useState("");
  const [record, { isLoading }] = useRecordOrderPaymentMutation();

  const submit = async () => {
    const num = Number(amount);
    if (!num || num <= 0) {
      notify.error("Enter a valid amount");
      return;
    }
    try {
      await record({
        id: orderId,
        body: {
          amount: Math.round(num * 100), // GHS → pesewas
          method,
          note: note.trim() || undefined,
        },
      }).unwrap();
      notify.success("Payment recorded");
      setAmount("");
      setNote("");
      onClose();
    } catch (err) {
      notify.error("Couldn't record payment", {
        description: extractApiError(err).message,
      });
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="mb-4 font-serif text-[22px]">Record a payment</h2>
      <div className="grid gap-4">
        <TextField
          label="Amount (GHS)"
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="grid gap-[7px]">
          <span className="text-[12.5px] font-semibold uppercase tracking-[0.06em] text-ink/60">
            Method
          </span>
          <Select
            value={method}
            onChange={(e) =>
              setMethod(e.target.value as IRecordPaymentInput["method"])
            }
          >
            {METHODS.map((m) => (
              <option key={m} value={m}>
                {m.replace("_", " ")}
              </option>
            ))}
          </Select>
        </div>
        <TextField
          label="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
      <div className="mt-5 flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button isLoading={isLoading} loadingText="Recording…" onClick={submit}>
          Record
        </Button>
      </div>
    </Modal>
  );
}
