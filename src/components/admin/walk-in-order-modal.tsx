"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { TextField } from "@/components/ui/TextField";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { notify } from "@/lib/notify";
import { extractApiError } from "@/lib/extract-api-error";
import { formatMoney } from "@/lib/format-money";
import { useGetProductsQuery } from "@/redux/products/products-api";
import { useCreateOrderMutation } from "@/redux/orders/orders-api";

interface Line {
  productId: string;
  quantity: number;
}

/** Records a counter/phone order on a customer's behalf. Items come from the
 * live catalogue (available only); the backend prices and snapshots them. */
export function WalkInOrderModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { data } = useGetProductsQuery({ isAvailable: true, limit: 100 });
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [lines, setLines] = useState<Line[]>([{ productId: "", quantity: 1 }]);

  const products = data?.data ?? [];
  const priceOf = (id: string) => products.find((p) => p.id === id)?.price ?? 0;
  const total = lines.reduce(
    (sum, l) => sum + priceOf(l.productId) * l.quantity,
    0,
  );

  const setLine = (i: number, patch: Partial<Line>) => {
    setLines((prev) => prev.map((l, n) => (n === i ? { ...l, ...patch } : l)));
  };

  const submit = async () => {
    const items = lines.filter((l) => l.productId && l.quantity > 0);
    if (!fullName.trim() || phone.trim().length < 6) {
      notify.error("Enter the customer's name and phone");
      return;
    }
    if (items.length === 0) {
      notify.error("Add at least one item");
      return;
    }
    try {
      const res = await createOrder({
        fullName: fullName.trim(),
        phone: phone.trim(),
        note: note.trim() || undefined,
        items,
      }).unwrap();
      notify.success(`Order recorded — ${res.data.code}`);
      onClose();
      router.push(`/admin/orders/${res.data.id}`);
    } catch (err) {
      notify.error("Couldn't record the order", {
        description: extractApiError(err).message,
      });
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="mb-4 font-serif text-[22px]">Record a walk-in order</h2>
      <div className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Customer name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <TextField
            label="Phone"
            placeholder="+233 24 000 0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="grid gap-2.5">
          <span className="text-[12.5px] font-semibold uppercase tracking-[0.06em] text-ink/60">
            Items
          </span>
          {lines.map((line, i) => (
            <div key={i} className="flex items-center gap-2">
              <Select
                value={line.productId}
                onChange={(e) => setLine(i, { productId: e.target.value })}
                wrapperClassName="flex-1"
              >
                <option value="">Choose an item…</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {formatMoney(p.price, p.currency)}
                  </option>
                ))}
              </Select>
              <input
                type="number"
                min={1}
                max={500}
                value={line.quantity}
                aria-label="Quantity"
                onChange={(e) =>
                  setLine(i, { quantity: Math.max(1, Number(e.target.value)) })
                }
                className="w-[76px] rounded-[12px] border-[1.5px] border-ink/20 bg-cream px-3 py-[11px] text-center font-sans text-[15px] outline-none transition-colors focus:border-accent"
              />
              {lines.length > 1 ? (
                <button
                  type="button"
                  aria-label="Remove line"
                  onClick={() =>
                    setLines((prev) => prev.filter((_, n) => n !== i))
                  }
                  className="text-[15px] font-semibold text-danger"
                >
                  ✕
                </button>
              ) : null}
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setLines((prev) => [...prev, { productId: "", quantity: 1 }])
            }
            className="justify-self-start text-[13.5px] font-semibold text-accent"
          >
            + Add another item
          </button>
        </div>

        <TextField
          label="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className="flex justify-between border-t border-ink/10 pt-3 text-[15px]">
          <span className="text-ink/55">Total</span>
          <span className="font-semibold">{formatMoney(total)}</span>
        </div>
      </div>
      <div className="mt-5 flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button isLoading={isLoading} loadingText="Recording…" onClick={submit}>
          Record order
        </Button>
      </div>
    </Modal>
  );
}
