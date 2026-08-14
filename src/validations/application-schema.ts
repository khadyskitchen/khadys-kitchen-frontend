import { z } from "zod";

/**
 * Bake School application form. Mirrors the backend `applySchema`: name +
 * phone required, `selectedFeeItemIds` carries the fee picks, and payment is
 * part of applying — `payMode` chooses between the full bill and a part
 * payment (`partAmount`, GHS). Amount bounds and the email requirement depend
 * on the applicant's live fee total, so the form validates those at submit;
 * this schema owns shape and formats.
 */
const REQUIRED_MESSAGE =
  "Please add your full name and a phone number we can reach you on.";

export const applicationSchema = z.object({
  name: z.string().trim().min(1, REQUIRED_MESSAGE),
  phone: z.string().trim().min(1, REQUIRED_MESSAGE),
  email: z
    .union([z.literal(""), z.string().email("Please enter a valid email.")])
    .optional(),
  location: z.string().trim().optional(),
  selectedFeeItemIds: z.array(z.string()),
  message: z.string().trim().optional(),
  /** full = the whole bill now; part = any amount now, balance later. */
  payMode: z.enum(["full", "part"]),
  /** GHS (major units) — only read when payMode is "part". */
  partAmount: z.string().trim().optional(),
});

export type ApplicationValues = z.infer<typeof applicationSchema>;

/**
 * The smallest first payment that confirms a registration, as a fraction of
 * the bill. Mirrors the backend `MIN_FIRST_PAYMENT_RATIO` (config/constants):
 * an application only becomes real once at least this much is paid.
 */
export const MIN_FIRST_PAYMENT_RATIO = 0.4;

/**
 * Registration status lookup (`POST /applications/lookup`). Mirrors the
 * backend `lookupApplicationSchema`: the receipt code plus the email or phone
 * the registration was made with.
 */
export const applicationLookupSchema = z.object({
  code: z
    .string()
    .trim()
    .min(4, "Enter the receipt code from your registration (KK-A…).")
    .max(40, "That code looks too long - double-check it."),
  contact: z
    .string()
    .trim()
    .min(3, "Enter the email or phone number you registered with.")
    .max(150, "That contact looks too long - double-check it."),
});

export type ApplicationLookupValues = z.infer<typeof applicationLookupSchema>;
