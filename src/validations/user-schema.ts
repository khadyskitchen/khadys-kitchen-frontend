import { z } from "zod";
import { UserRole } from "@/types/user.types";

/**
 * Team-management form schemas, mirroring the backend `user-validation.ts`
 * (create/update) and its `passwordField` policy: 8-128 chars with an
 * uppercase letter, a lowercase letter, a number, and a special character.
 */
const password = z
  .string()
  .min(8, "Use at least 8 characters")
  .max(128, "Use at most 128 characters")
  .regex(/[a-z]/, "Add a lowercase letter")
  .regex(/[A-Z]/, "Add an uppercase letter")
  .regex(/[0-9]/, "Add a number")
  .regex(/[^A-Za-z0-9]/, "Add a special character");

const phone = z
  .string()
  .trim()
  .refine((v) => v === "" || (v.length >= 6 && v.length <= 20), {
    message: "Enter a valid phone number",
  });

export const createTeamMemberSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50),
  lastName: z.string().trim().min(1, "Last name is required").max(50),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email")
    .max(255),
  phone,
  password,
  role: z.enum(UserRole),
});
export type CreateTeamMemberValues = z.infer<typeof createTeamMemberSchema>;

export const updateTeamMemberSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50),
  lastName: z.string().trim().min(1, "Last name is required").max(50),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email")
    .max(255),
  phone,
});
export type UpdateTeamMemberValues = z.infer<typeof updateTeamMemberSchema>;
