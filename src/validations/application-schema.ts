import { z } from "zod";

/**
 * Bake School application form.
 *
 * There is no backend contract to mirror yet — this is a marketing lead form —
 * so the rules match the design's own validation: only name and phone are
 * required, everything else is optional. The shared copy is surfaced in a
 * single error banner, matching the design.
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
  // null = not answered yet; the toggle sets true/false.
  hostel: z.boolean().nullable(),
  message: z.string().trim().optional(),
});

export type ApplicationValues = z.infer<typeof applicationSchema>;
