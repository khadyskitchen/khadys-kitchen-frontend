import { z } from "zod";

/**
 * Contact message form. Like the Apply form, this is a marketing lead form with
 * no backend contract yet, so the rules match the design: name, a contact
 * method, and a message are all required; topic defaults to "An order".
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
  name: z.string().trim().min(1, REQUIRED_MESSAGE),
  contact: z.string().trim().min(1, REQUIRED_MESSAGE),
  message: z.string().trim().min(1, REQUIRED_MESSAGE),
  topic: z.enum(CONTACT_TOPICS),
  /** Honeypot — humans never see it; bots that fill it are rejected. */
  website: z.string().max(0, "Something went wrong").optional(),
});

export type ContactValues = z.infer<typeof contactSchema>;
