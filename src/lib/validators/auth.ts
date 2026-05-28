import { z } from "zod";

export const authCredentialsSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(72, "Password must be 72 characters or fewer."),
});

export type AuthCredentials = z.infer<typeof authCredentialsSchema>;
