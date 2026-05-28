import Link from "next/link";
import {
  Building2,
  Github,
  Globe,
  GraduationCap,
  Linkedin,
  MapPin,
  ShieldCheck,
  UserRoundX,
} from "lucide-react";

import { BrandMark } from "@/components/layout/brand-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/validators/env";

export const dynamic = "force-dynamic";

type PublicProfilePageProps = {
  params: Promise<{
    id: string;
  }>;
};

const profileSelect =
  "user_id, display_name, headline, university, major, location, github_url, linkedin_url, portfolio_url, bio, is_email_verified";

function NotFoundState({ id }: { id: string }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <BrandMark />
          <Badge variant="outline">Public profile</Badge>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-4 px-6 py-14 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <UserRoundX className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-normal">Profile not found</h1>
              <p className="max-w-md text-sm leading-6 text-muted-foreground">
                No public PersonaVault profile is available for `{id}` yet.
              </p>
            </div>
            <Button asChild variant="link">
              <Link href="/">Back to PersonaVault AI</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { id } = await params;

  if (!isSupabaseConfigured()) {
    return <NotFoundState id={id} />;
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select(profileSelect)
    .eq("user_id", id)
    .maybeSingle();

  if (!profile) {
    return <NotFoundState id={id} />;
  }

  const links = [
    {
      label: "GitHub",
      href: profile.github_url,
      icon: Github,
    },
    {
      label: "LinkedIn",
      href: profile.linkedin_url,
      icon: Linkedin,
    },
    {
      label: "Portfolio",
      href: profile.portfolio_url,
      icon: Globe,
    },
  ].filter((link) => link.href);

  const details = [
    {
      label: "University",
      value: profile.university,
      icon: Building2,
    },
    {
      label: "Major",
      value: profile.major,
      icon: GraduationCap,
    },
    {
      label: "Location",
      value: profile.location,
      icon: MapPin,
    },
  ].filter((detail) => detail.value);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <BrandMark />
          <Badge variant="secondary">Public profile</Badge>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-white">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-4">
                <Badge variant="outline">PersonaVault public identity</Badge>
                <div className="space-y-2">
                  <CardTitle className="text-3xl tracking-normal sm:text-4xl">
                    {profile.display_name}
                  </CardTitle>
                  {profile.headline ? (
                    <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                      {profile.headline}
                    </p>
                  ) : null}
                </div>
              </div>
              <Badge variant={profile.is_email_verified ? "success" : "outline"}>
                <ShieldCheck className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                {profile.is_email_verified ? "Email verified" : "Email pending"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="grid gap-4 md:grid-cols-3">
              {details.length > 0 ? (
                details.map((detail) => {
                  const Icon = detail.icon;

                  return (
                    <div key={detail.label} className="rounded-md border bg-background p-4">
                      <Icon className="mb-3 h-5 w-5 text-primary" aria-hidden="true" />
                      <div className="text-xs font-medium uppercase tracking-normal text-muted-foreground">
                        {detail.label}
                      </div>
                      <div className="mt-1 text-sm font-medium">{detail.value}</div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground md:col-span-3">
                  Education and location details have not been published yet.
                </div>
              )}
            </div>

            {profile.bio ? (
              <section className="rounded-md border bg-white p-5">
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-normal text-muted-foreground">
                  Bio
                </h2>
                <p className="whitespace-pre-line text-sm leading-7 text-foreground">{profile.bio}</p>
              </section>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  label: "Email verified",
                  active: profile.is_email_verified,
                },
                {
                  label: "GitHub linked",
                  active: Boolean(profile.github_url),
                },
                {
                  label: "Portfolio linked",
                  active: Boolean(profile.portfolio_url),
                },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center justify-between rounded-md border bg-background p-3"
                >
                  <span className="text-sm font-medium">{badge.label}</span>
                  <Badge variant={badge.active ? "success" : "outline"}>
                    {badge.active ? "Yes" : "Not yet"}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row">
              {links.length > 0 ? (
                links.map((link) => {
                  const Icon = link.icon;

                  return (
                    <Button key={link.label} asChild variant="outline">
                      <a href={link.href ?? "#"} target="_blank" rel="noreferrer">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        {link.label}
                      </a>
                    </Button>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground">No external links published yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
        <Button asChild variant="link" className="mt-6 px-0">
          <Link href="/">Back to PersonaVault AI</Link>
        </Button>
      </main>
    </div>
  );
}
