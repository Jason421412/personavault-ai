import { z } from "zod";

const emptyStringToUndefined = (value: unknown) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : undefined;
};

const optionalText = (max: number, label: string) =>
  z
    .string()
    .trim()
    .max(max, `${label} must be ${max} characters or fewer.`)
    .optional();

const optionalHttpUrl = (label: string) =>
  z.preprocess(
    emptyStringToUndefined,
    z
      .string()
      .url(`${label} must be a valid URL.`)
      .refine(
        (value) => value.startsWith("https://") || value.startsWith("http://"),
        `${label} must start with http:// or https://.`,
      )
      .optional(),
  );

export const profileFormSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Display name must be at least 2 characters.")
    .max(120, "Display name must be 120 characters or fewer."),
  headline: optionalText(160, "Headline"),
  university: optionalText(120, "University"),
  major: optionalText(120, "Major"),
  location: optionalText(120, "Location"),
  githubUrl: optionalHttpUrl("GitHub URL"),
  linkedinUrl: optionalHttpUrl("LinkedIn URL"),
  portfolioUrl: optionalHttpUrl("Portfolio URL"),
  bio: optionalText(1200, "Bio"),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function nullableString(value: string | undefined) {
  return value && value.length > 0 ? value : null;
}
