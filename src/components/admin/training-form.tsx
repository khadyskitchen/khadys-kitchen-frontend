"use client";

import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/admin/ui";
import { TextField } from "@/components/ui/TextField";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { notify } from "@/lib/notify";
import { extractApiError } from "@/lib/extract-api-error";
import { useCreateTrainingMutation } from "@/redux/trainings/trainings-api";
import {
  FEE_KINDS,
  TRAINING_STATUSES,
  trainingSchema,
  type TrainingFormValues,
} from "@/validations/training-schema";
import type { ITrainingInput } from "@/types/training.types";

const DEFAULTS: TrainingFormValues = {
  name: "",
  numeral: "",
  description: "",
  coverImage: "",
  status: "DRAFT",
  applicationsOpen: false,
  isPublished: false,
  startDate: "",
  endDate: "",
  capacity: "",
  hostelCapacity: "",
  tagline: "",
  heroHeading: "",
  heroSubtext: "",
  costsIntro: "",
  costsNote: "",
  bringIntro: "",
  feeItems: [],
  requirements: [],
  stats: [],
  highlights: [],
};

const s = (v: string | undefined) => (v && v.trim() ? v.trim() : undefined);

function toInput(v: TrainingFormValues): ITrainingInput {
  return {
    name: v.name.trim(),
    numeral: s(v.numeral),
    description: v.description.trim(),
    coverImage: s(v.coverImage),
    status: v.status,
    applicationsOpen: v.applicationsOpen,
    isPublished: v.isPublished,
    startDate: s(v.startDate),
    endDate: s(v.endDate),
    capacity: v.capacity ? Number(v.capacity) : undefined,
    hostelCapacity: v.hostelCapacity ? Number(v.hostelCapacity) : undefined,
    tagline: s(v.tagline),
    heroHeading: s(v.heroHeading),
    heroSubtext: s(v.heroSubtext),
    costsIntro: s(v.costsIntro),
    costsNote: s(v.costsNote),
    bringIntro: s(v.bringIntro),
    stats: v.stats,
    requirements: v.requirements.map((r) => ({ name: r.name, note: s(r.note) })),
    highlights: v.highlights.map((h) => h.value),
    feeItems: v.feeItems.map((f, i) => ({
      name: f.name,
      amount: Math.round(f.amount * 100), // GHS → pesewas
      kind: f.kind,
      required: f.required,
      note: s(f.note),
      suffix: s(f.suffix),
      priceLabel: s(f.priceLabel),
      position: i,
    })),
  };
}

const labelCls =
  "text-[12.5px] font-semibold uppercase tracking-[0.06em] text-ink/60";
const areaCls =
  "w-full rounded-[12px] border-[1.5px] border-ink/20 bg-cream px-[15px] py-3 font-sans text-[15px] text-ink outline-none transition-colors focus:border-accent";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 font-serif text-[20px] font-normal text-ink">{children}</h2>
  );
}

function Toggle({
  label,
  checked,
  ...props
}: { label: string; checked?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-[14px] font-medium text-ink">
      <input type="checkbox" className="h-4 w-4 accent-accent" checked={checked} {...props} />
      {label}
    </label>
  );
}

export function TrainingForm() {
  const router = useRouter();
  const [createTraining, { isLoading }] = useCreateTrainingMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TrainingFormValues>({
    resolver: zodResolver(trainingSchema),
    defaultValues: DEFAULTS,
  });

  const fees = useFieldArray({ control, name: "feeItems" });
  const reqs = useFieldArray({ control, name: "requirements" });
  const stats = useFieldArray({ control, name: "stats" });
  const highlights = useFieldArray({ control, name: "highlights" });

  const onSubmit = async (values: TrainingFormValues) => {
    try {
      const res = await createTraining(toInput(values)).unwrap();
      notify.success("Training created");
      router.push(`/admin/classes/${res.data.id}`);
    } catch (err) {
      const { message } = extractApiError(err);
      notify.error("Couldn't create the training", { description: message });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-[18px]">
      {/* Basics */}
      <Card className="p-[clamp(20px,3vw,28px)]">
        <SectionTitle>Basics</SectionTitle>
        <div className="grid gap-[18px]">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-[18px]">
            <TextField label="Cohort name" error={errors.name?.message} {...register("name")} />
            <TextField label="Numeral (e.g. 01)" error={errors.numeral?.message} {...register("numeral")} />
          </div>
          <div className="grid gap-[7px]">
            <span className={labelCls}>Description</span>
            <textarea rows={3} className={areaCls} {...register("description")} />
            {errors.description ? (
              <span className="text-[13px] text-danger">{errors.description.message}</span>
            ) : null}
          </div>
          <TextField label="Cover image URL" error={errors.coverImage?.message} {...register("coverImage")} />
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,180px),1fr))] gap-[18px]">
            <div className="grid gap-[7px]">
              <span className={labelCls}>Status</span>
              <Select className="py-3" {...register("status")}>
                {TRAINING_STATUSES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </Select>
            </div>
            <TextField label="Start date" type="date" {...register("startDate")} />
            <TextField label="End date" type="date" {...register("endDate")} />
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,180px),1fr))] gap-[18px]">
            <TextField label="Capacity" type="number" error={errors.capacity?.message} {...register("capacity")} />
            <TextField label="Hostel capacity" type="number" error={errors.hostelCapacity?.message} {...register("hostelCapacity")} />
          </div>
          <div className="flex flex-wrap gap-6">
            <Toggle label="Accepting applications" {...register("applicationsOpen")} />
            <Toggle label="Published (visible on the website)" {...register("isPublished")} />
          </div>
        </div>
      </Card>

      {/* Class-page copy */}
      <Card className="p-[clamp(20px,3vw,28px)]">
        <SectionTitle>Class page copy</SectionTitle>
        <div className="grid gap-[18px]">
          <TextField label="Hero eyebrow / tagline" {...register("tagline")} />
          <TextField label="Hero heading (leave blank for the default)" {...register("heroHeading")} />
          <div className="grid gap-[7px]">
            <span className={labelCls}>Hero subtext</span>
            <textarea rows={2} className={areaCls} {...register("heroSubtext")} />
          </div>
          <div className="grid gap-[7px]">
            <span className={labelCls}>Costs intro</span>
            <textarea rows={2} className={areaCls} {...register("costsIntro")} />
          </div>
          <div className="grid gap-[7px]">
            <span className={labelCls}>Costs note (hostel reminder etc.)</span>
            <textarea rows={2} className={areaCls} {...register("costsNote")} />
          </div>
          <div className="grid gap-[7px]">
            <span className={labelCls}>What-to-bring intro</span>
            <textarea rows={2} className={areaCls} {...register("bringIntro")} />
          </div>
        </div>
      </Card>

      {/* Fee items */}
      <Card className="p-[clamp(20px,3vw,28px)]">
        <div className="mb-4 flex items-center justify-between">
          <SectionTitle>Fee table</SectionTitle>
          <Button type="button" variant="outline" size="sm" onClick={() => fees.append({ name: "", amount: 0, kind: "OTHER", required: true, note: "", suffix: "", priceLabel: "" })}>
            + Add fee
          </Button>
        </div>
        <div className="grid gap-4">
          {fees.fields.length === 0 ? (
            <p className="text-[14px] text-ink/50">No fees yet. Add the registration, hostel, ingredients, etc.</p>
          ) : null}
          {fees.fields.map((field, i) => (
            <div key={field.id} className="grid gap-3 rounded-[14px] border border-ink/10 bg-oat/40 p-4">
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,160px),1fr))] gap-3">
                <TextField label="Name" error={errors.feeItems?.[i]?.name?.message} {...register(`feeItems.${i}.name`)} />
                <TextField label="Amount (GHS)" type="number" step="0.01" {...register(`feeItems.${i}.amount`, { valueAsNumber: true })} />
                <div className="grid gap-[7px]">
                  <span className={labelCls}>Kind</span>
                  <Select className="py-3" {...register(`feeItems.${i}.kind`)}>
                    {FEE_KINDS.map((k) => (<option key={k} value={k}>{k}</option>))}
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,160px),1fr))] gap-3">
                <TextField label="Note" {...register(`feeItems.${i}.note`)} />
                <TextField label="Suffix (e.g. for 2 months)" {...register(`feeItems.${i}.suffix`)} />
                <TextField label="Price label (Free / — )" {...register(`feeItems.${i}.priceLabel`)} />
              </div>
              <div className="flex items-center justify-between">
                <Toggle label="Charged (part of the bill)" {...register(`feeItems.${i}.required`)} />
                <button type="button" onClick={() => fees.remove(i)} className="text-[13px] font-semibold text-danger">Remove</button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Stats */}
      <Card className="p-[clamp(20px,3vw,28px)]">
        <div className="mb-4 flex items-center justify-between">
          <SectionTitle>Hero stats</SectionTitle>
          <Button type="button" variant="outline" size="sm" onClick={() => stats.append({ value: "", label: "" })}>+ Add stat</Button>
        </div>
        <div className="grid gap-3">
          {stats.fields.map((field, i) => (
            <div key={field.id} className="flex flex-wrap items-end gap-3">
              <TextField label="Value" className="min-w-[120px]" {...register(`stats.${i}.value`)} />
              <TextField label="Label" className="min-w-[160px]" {...register(`stats.${i}.label`)} />
              <button type="button" onClick={() => stats.remove(i)} className="pb-3 text-[13px] font-semibold text-danger">Remove</button>
            </div>
          ))}
        </div>
      </Card>

      {/* Requirements (items to bring) */}
      <Card className="p-[clamp(20px,3vw,28px)]">
        <div className="mb-4 flex items-center justify-between">
          <SectionTitle>Items to bring</SectionTitle>
          <Button type="button" variant="outline" size="sm" onClick={() => reqs.append({ name: "", note: "" })}>+ Add item</Button>
        </div>
        <div className="grid gap-3">
          {reqs.fields.map((field, i) => (
            <div key={field.id} className="flex flex-wrap items-end gap-3">
              <TextField label="Item" className="min-w-[160px]" {...register(`requirements.${i}.name`)} />
              <TextField label="Note / price" className="min-w-[160px]" {...register(`requirements.${i}.note`)} />
              <button type="button" onClick={() => reqs.remove(i)} className="pb-3 text-[13px] font-semibold text-danger">Remove</button>
            </div>
          ))}
        </div>
      </Card>

      {/* Highlights / prospectus */}
      <Card className="p-[clamp(20px,3vw,28px)]">
        <div className="mb-4 flex items-center justify-between">
          <SectionTitle>Prospectus / highlights</SectionTitle>
          <Button type="button" variant="outline" size="sm" onClick={() => highlights.append({ value: "" })}>+ Add</Button>
        </div>
        <div className="grid gap-3">
          {highlights.fields.map((field, i) => (
            <div key={field.id} className="flex items-end gap-3">
              <TextField label={`Item ${String(i + 1)}`} className="min-w-[220px]" {...register(`highlights.${i}.value`)} />
              <button type="button" onClick={() => highlights.remove(i)} className="pb-3 text-[13px] font-semibold text-danger">Remove</button>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" isLoading={isLoading} loadingText="Creating…">Create training</Button>
      </div>
    </form>
  );
}
