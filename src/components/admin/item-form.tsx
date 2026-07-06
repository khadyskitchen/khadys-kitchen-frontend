"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/lib/admin/store";
import { Select } from "@/components/ui/Select";
import {
  ITEM_CATEGORIES,
  LEAD_TIMES,
  type AdminItem,
  type ItemCategory,
} from "@/lib/admin/data";

const labelClass =
  "grid gap-2 text-[13px] font-semibold uppercase tracking-[0.06em] text-ink/60";
const fieldClass =
  "w-full rounded-[12px] border border-ink/20 bg-cream px-4 py-[13px] font-sans text-[15.5px] text-ink outline-none transition-colors focus:border-accent";

export function ItemForm({ initial }: { initial?: AdminItem }) {
  const { saveItem } = useAdmin();
  const router = useRouter();

  const [name, setName] = useState(initial?.name ?? "");
  const [cat, setCat] = useState<ItemCategory>(initial?.cat ?? "Pastry");
  const [price, setPrice] = useState(initial ? String(initial.price) : "");
  const [unit, setUnit] = useState(initial?.unit ?? "");
  const [lead, setLead] = useState(initial?.lead ?? LEAD_TIMES[0]);
  const [img, setImg] = useState(initial?.img ?? "");
  const [desc, setDesc] = useState(initial?.desc ?? "");
  const [error, setError] = useState("");

  const cancelHref = initial ? `/admin/items/${initial.id}` : "/admin/items";

  const save = () => {
    if (!name.trim() || !price || isNaN(Number(price))) {
      setError("An item needs at least a name and a valid price.");
      return;
    }
    saveItem({ forId: initial?.id ?? null, name, cat, price, unit, lead, desc, img });
    router.push("/admin/items");
  };

  return (
    <div className="max-w-[760px]" style={{ animation: "kk-rise .5s both" }}>
      <Link
        href={cancelHref}
        className="mb-5 inline-block text-[13.5px] font-semibold uppercase tracking-[0.08em] text-ink/65 no-underline transition-colors hover:text-accent"
      >
        ← Cancel
      </Link>
      <div className="grid gap-5 rounded-[18px] border border-ink/10 bg-card p-[clamp(20px,3.5vw,32px)]">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-[18px]">
          <label className={labelClass}>
            Item name
            <input
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              placeholder="e.g. Coconut Buns"
              className={fieldClass}
            />
          </label>
          <label className={labelClass}>
            Category
            <Select
              value={cat}
              onChange={(e) => setCat(e.target.value as ItemCategory)}
              wrapperClassName="w-full"
              className="rounded-[12px] border py-[13px] pl-4 text-[15.5px]"
            >
              {ITEM_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </label>
          <label className={labelClass}>
            Price · GHS
            <input
              type="number"
              min="0"
              value={price}
              onChange={(e) => { setPrice(e.target.value); setError(""); }}
              placeholder="0"
              className={fieldClass}
            />
          </label>
          <label className={labelClass}>
            Unit / portion
            <input
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="e.g. Box of 6"
              className={fieldClass}
            />
          </label>
          <label className={labelClass}>
            Lead time
            <Select
              value={lead}
              onChange={(e) => setLead(e.target.value)}
              wrapperClassName="w-full"
              className="rounded-[12px] border py-[13px] pl-4 text-[15.5px]"
            >
              {LEAD_TIMES.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </Select>
          </label>
          <label className={labelClass}>
            Image URL
            <input
              value={img}
              onChange={(e) => setImg(e.target.value)}
              placeholder="https://…"
              className={fieldClass}
            />
          </label>
        </div>

        {img ? (
          <Image
            src={img}
            alt="Item preview"
            width={120}
            height={120}
            unoptimized
            className="h-[120px] w-[120px] rounded-[16px] border border-ink/15 object-cover"
          />
        ) : null}

        <label className={labelClass}>
          Description
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={4}
            placeholder="How it's made, what it contains, when it's at its best…"
            className={`${fieldClass} resize-y`}
          />
        </label>

        {error ? (
          <div className="rounded-[12px] border border-danger/25 bg-danger/[0.08] px-4 py-3 text-[14px] text-danger">
            {error}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={save}
            className="cursor-pointer rounded-full border-none bg-accent px-8 py-[15px] font-sans text-[15px] font-semibold text-[#FDFAF3] transition-colors hover:bg-ink"
          >
            Save item
          </button>
          <Link
            href={cancelHref}
            className="inline-block rounded-full border-[1.5px] border-ink/25 bg-transparent px-7 py-[13.5px] text-[15px] font-semibold text-ink no-underline transition-colors hover:border-accent hover:text-accent"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
