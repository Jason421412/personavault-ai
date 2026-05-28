"use server";

import { revalidatePath } from "next/cache";

import type { Database } from "@/lib/supabase/types";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/validators/env";
import { nullableString, profileFormSchema } from "@/lib/validators/profile";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export type ProfileActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  profile?: ProfileRow;
  fieldErrors?: Partial<Record<keyof typeof profileFieldNames, string>>;
};

const profileFieldNames = {
  displayName: true,
  headline: true,
  university: true,
  major: true,
  location: true,
  githubUrl: true,
  linkedinUrl: true,
  portfolioUrl: true,
  bio: true,
};

function formDataToObject(formData: FormData) {
  return {
    displayName: formData.get("displayName"),
    headline: formData.get("headline"),
    university: formData.get("university"),
    major: formData.get("major"),
    location: formData.get("location"),
    githubUrl: formData.get("githubUrl"),
    linkedinUrl: formData.get("linkedinUrl"),
    portfolioUrl: formData.get("portfolioUrl"),
    bio: formData.get("bio"),
  };
}

function getFieldErrors(error: ReturnType<typeof profileFormSchema.safeParse>["error"]) {
  const fieldErrors: ProfileActionState["fieldErrors"] = {};

  error?.issues.forEach((issue) => {
    const key = issue.path[0];

    if (typeof key === "string" && key in profileFieldNames) {
      fieldErrors[key as keyof typeof profileFieldNames] = issue.message;
    }
  });

  return fieldErrors;
}

export async function saveProfile(
  _previousState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  if (!isSupabaseConfigured()) {
    return {
      status: "error",
      message: "Supabase is not configured. Add your env values before saving a profile.",
    };
  }

  const parsed = profileFormSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the highlighted profile fields.",
      fieldErrors: getFieldErrors(parsed.error),
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: "error",
      message: "Your session expired. Please sign in again before saving.",
    };
  }

  const { data: existingProfile, error: existingProfileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingProfileError) {
    return {
      status: "error",
      message:
        "Could not load your existing profile. Make sure docs/supabase-schema.sql has been run.",
    };
  }

  const now = new Date().toISOString();
  const profilePayload = {
    user_id: user.id,
    display_name: parsed.data.displayName,
    headline: nullableString(parsed.data.headline),
    university: nullableString(parsed.data.university),
    major: nullableString(parsed.data.major),
    location: nullableString(parsed.data.location),
    github_url: nullableString(parsed.data.githubUrl),
    linkedin_url: nullableString(parsed.data.linkedinUrl),
    portfolio_url: nullableString(parsed.data.portfolioUrl),
    bio: nullableString(parsed.data.bio),
    is_email_verified: Boolean(user.email_confirmed_at),
    is_github_verified: false,
    updated_at: now,
  };

  const isCreate = !existingProfile;

  const profileMutation = isCreate
    ? supabase
        .from("profiles")
        .insert({
          ...profilePayload,
          created_at: now,
        })
        .select()
        .single()
    : supabase
        .from("profiles")
        .update(profilePayload)
        .eq("user_id", user.id)
        .select()
        .single();

  const { data: savedProfile, error: profileError } = await profileMutation;

  if (profileError || !savedProfile) {
    return {
      status: "error",
      message: profileError?.message ?? "Could not save your profile.",
    };
  }

  const { error: auditError } = await supabase.from("audit_logs").insert({
    user_id: user.id,
    action: isCreate ? "PROFILE_CREATED" : "PROFILE_UPDATED",
    entity_type: "profile",
    entity_id: savedProfile.id,
    metadata: {
      display_name: savedProfile.display_name,
    },
  });

  if (auditError) {
    return {
      status: "error",
      message:
        "Profile saved, but the audit event could not be recorded. Check the audit_logs table policy.",
      profile: savedProfile,
    };
  }

  revalidatePath("/app/profile");
  revalidatePath(`/u/${user.id}`);
  revalidatePath("/app/audit");

  return {
    status: "success",
    message: isCreate ? "Profile created." : "Profile updated.",
    profile: savedProfile,
  };
}
