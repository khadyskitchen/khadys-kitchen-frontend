import { z } from "zod";

/**
 * Contact message form. Mirrors the backend `contactSchema`
 * (contact-validation.ts): name, a contact method, and a message are all
 * required, with the same length caps (150/150/5000); topic defaults to
 * "An order".
 */
export const CONTACT_TOPICS = [
  "An order",
  "A custom cake",
  "Baking classes",
  "Something else",
] as const;

const REQUIRED_MESSAGE =
  "Please add your name, a way to reach you, and a short message.";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, REQUIRED_MESSAGE)
    .max(150, "Please keep your name under 150 characters."),
  contact: z
    .string()
    .trim()
    .min(1, REQUIRED_MESSAGE)
    .max(150, "Please keep your contact under 150 characters."),
  message: z
    .string()
    .trim()
    .min(1, REQUIRED_MESSAGE)
    .max(5000, "Please keep your message under 5000 characters."),
  topic: z.enum(CONTACT_TOPICS),
  /** Honeypot - humans never see it; bots that fill it are rejected. */
  website: z.string().max(0, "Something went wrong").optional(),
});

export type ContactValues = z.infer<typeof contactSchema>;
