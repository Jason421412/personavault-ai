"use client";

import { useActionState } from "react";
import { CheckCircle2, Loader2, Save, UserRoundCheck } from "lucide-react";

import { saveProfile, type ProfileActionState } from "@/app/app/profile/actions";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Database } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { useFormStatus } from "react-dom";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

type ProfileFormProps = {
  profile: ProfileRow | null;
};

const textFields = [
  {
    name: "displayName",
    label: "Display name",
    placeholder: "Jane Lee",
    required: true,
  },
  {
    name: "headline",
    label: "Headline",
    placeholder: "Computer Science student and AI product builder",
    required: false,
  },
  {
    name: "university",
    label: "University",
    placeholder: "National University of Singapore",
    required: false,
  },
  {
    name: "major",
    label: "Major",
    placeholder: "Computer Science",
    required: false,
  },
  {
    name: "location",
    label: "Location",
    placeholder: "Singapore",
    required: false,
  },
] as const;

const linkFields = [
  {
    name: "githubUrl",
    label: "GitHub URL",
    placeholder: "https://github.com/username",
  },
  {
    name: "linkedinUrl",
    label: "LinkedIn URL",
    placeholder: "https://linkedin.com/in/username",
  },
  {
    name: "portfolioUrl",
    label: "Portfolio URL",
    placeholder: "https://yourdomain.com",
  },
] as const;

function getInitialFormState(profile: ProfileRow | null): ProfileActionState {
  return {
    status: "idle",
    profile: profile ?? undefined,
  };
}

function getFieldValue(profile: ProfileRow | null, name: string) {
  switch (name) {
    case "displayName":
      return profile?.display_name ?? "";
    case "headline":
      return profile?.headline ?? "";
    case "university":
      return profile?.university ?? "";
    case "major":
      return profile?.major ?? "";
    case "location":
      return profile?.location ?? "";
    case "githubUrl":
      return profile?.github_url ?? "";
    case "linkedinUrl":
      return profile?.linkedin_url ?? "";
    case "portfolioUrl":
      return profile?.portfolio_url ?? "";
    case "bio":
      return profile?.bio ?? "";
    default:
      return "";
  }
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <Save className="h-4 w-4" aria-hidden="true" />
      )}
      {pending ? "Saving profile" : "Save profile"}
    </Button>
  );
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [state, formAction] = useActionState(saveProfile, getInitialFormState(profile));
  const activeProfile = state.profile ?? profile;
  const hasProfile = Boolean(activeProfile);

  return (
    <div className="space-y-6">
      {!hasProfile ? (
        <EmptyState
          icon={UserRoundCheck}
          title="Create your verified profile"
          description="No profile exists yet. Complete the form below and save once to publish your public identity page."
        />
      ) : null}

      {state.message ? (
        <div
          className={cn(
            "flex items-start gap-3 rounded-md border p-3 text-sm",
            state.status === "success" && "border-emerald-200 bg-emerald-50 text-emerald-800",
            state.status === "error" && "border-red-200 bg-red-50 text-red-800",
          )}
          role={state.status === "error" ? "alert" : "status"}
          aria-live="polite"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{state.message}</span>
        </div>
      ) : null}

      <form action={formAction}>
        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Profile details</CardTitle>
            <Badge variant={hasProfile ? "success" : "outline"}>
              {hasProfile ? "Profile active" : "Create on save"}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              {textFields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name}>
                    {field.label}
                    {field.required ? <span className="text-destructive"> *</span> : null}
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    placeholder={field.placeholder}
                    required={field.required}
                    defaultValue={getFieldValue(activeProfile, field.name)}
                  />
                  {state.fieldErrors?.[field.name] ? (
                    <p className="text-xs text-destructive">{state.fieldErrors[field.name]}</p>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {linkFields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="url"
                    placeholder={field.placeholder}
                    defaultValue={getFieldValue(activeProfile, field.name)}
                  />
                  {state.fieldErrors?.[field.name] ? (
                    <p className="text-xs text-destructive">{state.fieldErrors[field.name]}</p>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                placeholder="A concise professional bio for recruiters, collaborators, and proof-pack recipients."
                defaultValue={getFieldValue(activeProfile, "bio")}
              />
              {state.fieldErrors?.bio ? (
                <p className="text-xs text-destructive">{state.fieldErrors.bio}</p>
              ) : null}
            </div>

            <div className="flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Your public profile is available at `/u/[your-user-id]` after saving.
              </p>
              <SubmitButton />
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
