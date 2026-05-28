import Link from "next/link";
import type { Route } from "next";
import { AlertCircle, ExternalLink } from "lucide-react";

import { PageShell } from "@/components/app/page-shell";
import { ProfileForm } from "@/components/profile/profile-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select()
    .eq("user_id", user?.id ?? "")
    .maybeSingle();

  return (
    <PageShell
      title="Verified Profile"
      description="Create and maintain the public identity layer that future proof packs can point back to."
      actions={
        user ? (
          <Button asChild variant="outline">
            <Link href={`/u/${user.id}` as Route}>
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Public profile
            </Link>
          </Button>
        ) : null
      }
    >
      {error ? (
        <Card className="border-red-200 bg-red-50/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-900">
              <AlertCircle className="h-5 w-5" aria-hidden="true" />
              Profile table is not ready
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-red-800">
            <p>
              Supabase returned an error while loading your profile. Run
              `docs/supabase-schema.sql` in the Supabase SQL Editor, then refresh this page.
            </p>
            <p className="rounded-md bg-white/70 p-3 font-mono text-xs">{error.message}</p>
          </CardContent>
        </Card>
      ) : (
        <ProfileForm profile={profile} />
      )}
    </PageShell>
  );
}
