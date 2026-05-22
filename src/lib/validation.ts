import z from "zod";
import zxcvbn from "zxcvbn";

export const passwordSchema = z
  .string()
  .min(1, { message: "Password is required" })
  .min(6, { message: "Password must be at least 6 characters" })
  .regex(/[^A-Za-z0-9]/, {
    message: "Password must contain at least one special character",
  })
  .refine((val) => zxcvbn(val).score >= 3, {
    message: "Password is too weak",
  });
