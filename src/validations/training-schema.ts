import { z } from "zod";

/**
 * Admin create/edit training form. Mirrors the backend create schema. Money is
 * entered in GHS and converted to pesewas on submit; the bullet lists (what
 * you'll learn, what to bring, what's included, who it's for) drive the public
 * class page.
 */
export const FEE_KINDS = [
  "REGISTRATION",
  "HOSTEL",
  "UNIFORM",
  "INGREDIENTS",
  "CERTIFICATE",
  "OTHER",
] as const;

/** On-site vs online delivery (matches the backend `TrainingCategory` enum). */
export const TRAINING_CATEGORIES = ["IN_PERSON", "ONLINE"] as const;
export type TrainingCategoryValue = (typeof TRAINING_CATEGORIES)[number];

export const TRAINING_CATEGORY_LABELS: Record<TrainingCategoryValue, string> = {
  IN_PERSON: "In-person",
  ONLINE: "Online",
};

/**
 * How a fee item is charged. Maps to the backend's `required` + `choiceGroup`
 * pair on submit:
 * - ALWAYS       → required, standalone (every applicant pays it)
 * - OPTIONAL     → an add-on the applicant may tick when applying
 * - COURSE_CHOICE → one of the class's mutually exclusive course-fee options -
 *   the applicant picks exactly one; the amounts are never summed.
 */
export const CHARGE_TYPES = ["ALWAYS", "OPTIONAL", "COURSE_CHOICE"] as const;
export type ChargeType = (typeof CHARGE_TYPES)[number];

export const CHARGE_TYPE_LABELS: Record<ChargeType, string> = {
  ALWAYS: "Always charged",
  OPTIONAL: "Optional add-on - applicant may add it",
  COURSE_CHOICE: "Course fee option - applicant picks one",
};

/** The single choice group the admin console manages. */
export const COURSE_FEE_GROUP = "course-fee";

const feeItemSchema = z.object({
  name: z.string().trim().min(1, "Required").max(150),
  // GHS (major units, via valueAsNumber); converted to pesewas on submit.
  amount: z.number({ message: "Enter a number" }).min(0, "Must be 0 or more").max(1_000_000),
  kind: z.enum(FEE_KINDS),
  charge: z.enum(CHARGE_TYPES),
  note: z.string().trim().max(300).optional(),
  suffix: z.string().trim().max(60).optional(),
  priceLabel: z.string().trim().max(60).optional(),
});

// Modeled as objects so react-hook-form's useFieldArray has stable ids.
// The 50-entry cap mirrors the backend's `bulletList` (training-validation.ts).
const bulletList = z
  .array(z.object({ value: z.string().trim().min(1, "Required").max(300) }))
  .max(50, "A list can hold at most 50 entries");

export const trainingSchema = z.object({
  name: z.string().trim().min(1, "A training name is required").max(150),
  summary: z.string().trim().min(1, "A summary is required").max(2000),
  learnOutcomes: bulletList,
  whatToBring: bulletList,
  included: bulletList,
  forWho: bulletList,
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  schedule: z.string().trim().max(200).optional(),
  duration: z.string().trim().max(100).optional(),
  mode: z.string().trim().max(150).optional(),
  category: z.enum(TRAINING_CATEGORIES),
  hasCertificate: z.boolean(),
  // Kept as a string in the form (no coerce, so form input === output types);
  // bounds mirror the backend's `capacity` (positive int, max 100,000).
  capacity: z
    .string()
    .optional()
    .refine(
      (v) => {
        if (!v || v.trim() === "") return true;
        const n = Number(v);
        return Number.isInteger(n) && n >= 1 && n <= 100_000;
      },
      { message: "Enter a whole number between 1 and 100,000" },
    ),
  applicationsOpen: z.boolean(),
  isPublished: z.boolean(),
  isFeatured: z.boolean(),
  // The 50-item cap mirrors the backend's `feeItems` (training-validation.ts).
  feeItems: z.array(feeItemSchema).max(50, "At most 50 fee items"),
});

export type TrainingFormValues = z.infer<typeof trainingSchema>;
