import { z } from "zod";

/**
 * Bake School application form. Mirrors the backend `applySchema`: name + phone
 * required, the rest optional. `hostel` is a nullable toggle (null = unanswered),
 * and `payNow` opts into paying online — which requires an email (Paystack needs
 * a receipt address), enforced by the refine below.
 */
const REQUIRED_MESSAGE =
  "Please add your full name and a phone number we can reach you on.";

export const applicationSchema = z
  .object({
    name: z.string().trim().min(1, REQUIRED_MESSAGE),
    phone: z.string().trim().min(1, REQUIRED_MESSAGE),
    email: z
      .union([z.literal(""), z.string().email("Please enter a valid email.")])
      .optional(),
    location: z.string().trim().optional(),
    // null = not answered yet; the toggle sets true/false.
    hostel: z.boolean().nullable(),
    message: z.string().trim().optional(),
    payNow: z.boolean(),
  })
  .refine((data) => !data.payNow || Boolean(data.email && data.email.length), {
    message: "Add an email so we can send your payment receipt.",
    path: ["email"],
  });

export type ApplicationValues = z.infer<typeof applicationSchema>;
