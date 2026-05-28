import { z } from "zod";

const emptyStringToUndefined = (value: unknown) => (value === "" ? undefined : value);

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

const optionalPublicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z
    .preprocess(emptyStringToUndefined, z.string().url().optional())
    .default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: z.preprocess(
    emptyStringToUndefined,
    z.string().url().optional(),
  ),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.preprocess(
    emptyStringToUndefined,
    z.string().optional(),
  ),
});

export function getSupabasePublicEnv() {
  return publicEnvSchema.parse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
}

export function getOptionalPublicEnv() {
  return optionalPublicEnvSchema.parse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
}

export function isSupabaseConfigured() {
  const result = optionalPublicEnvSchema.safeParse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  if (!result.success) {
    return false;
  }

  const env = result.data;

  return Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
