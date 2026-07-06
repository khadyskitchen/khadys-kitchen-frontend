import { z } from "zod";

/**
 * Admin product form schema — mirrors the backend `createProductSchema`
 * (product-validation.ts). Numeric fields are kept as strings in the form
 * (the training form's idiom) and converted in the submit mapper: price is
 * entered in GHS → pesewas (×100); stock left empty means "made to order".
 */
export const PRODUCT_CATEGORY_VALUES = [
  "BREAD",
  "PASTRY",
  "CAKE",
  "BOFROT",
  "SAVOURY",
] as const;

const wholeNumber = (max: number, message: string) =>
  z
    .string()
    .trim()
    .refine(
      (v) =>
        v === "" ||
        (/^\d+$/.test(v) && Number(v) >= 0 && Number(v) <= max),
      message,
    );

export const productSchema = z.object({
  name: z.string().trim().min(1, "A name is required").max(150),
  category: z.enum(PRODUCT_CATEGORY_VALUES),
  description: z.string().trim().max(2000).optional(),
  /** GHS in the form; pesewas over the wire. */
  price: z
    .string()
    .trim()
    .min(1, "Enter a price")
    .refine(
      (v) => Number(v) > 0 && Number(v) <= 1_000_000,
      "Enter a valid price",
    ),
  unit: z.string().trim().min(1, "A sale unit is required").max(60),
  leadTimeDays: wholeNumber(60, "Enter a whole number of days (0–60)"),
  image: z.union([z.literal(""), z.string().url("Enter a valid image URL")]),
  isAvailable: z.boolean(),
  /** Empty = made to order (no stock cap). */
  stock: wholeNumber(1_000_000, "Enter a whole number"),
  position: wholeNumber(10_000, "Enter a whole number"),
});

export type ProductFormValues = z.infer<typeof productSchema>;
