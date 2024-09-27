import { z } from "zod";

export const AuthValidationSchema = z.object({
  email: z.string().email({ message: "Must be a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

export type TAuthCredentialsValidation = z.infer<typeof AuthValidationSchema>;
