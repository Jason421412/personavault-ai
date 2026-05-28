import Link from "next/link";
import {
  Bot,
  Clock3,
  FileKey2,
  Fingerprint,
  LockKeyhole,
  Share2,
  ShieldCheck,
} from "lucide-react";

import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const pillars = [
  {
    title: "Verified profile",
    description: "Create a professional identity page with education, links, and verification status.",
    icon: Fingerprint,
  },
  {
    title: "Private vault",
    description: "Store sensitive documents with metadata, visibility controls, and SHA-256 hashes.",
    icon: LockKeyhole,
  },
  {
    title: "Proof packs",
    description: "Generate time-limited public links for selected documents and recipient contexts.",
    icon: Share2,
  },
  {
    title: "AI authenticity checks",
    description: "Turn suspicious offers or recruiter messages into structured risk reports.",
    icon: Bot,
  },
];

const trustOutcomes = [
  {
    label: "Vault integrity",
    icon: FileKey2,
  },
  {
    label: "Share confidence",
    icon: ShieldCheck,
  },
  {
    label: "Audit visibility",
    icon: Clock3,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="relative isolate overflow-hidden border-b bg-slate-950 text-white">
          <div className="absolute inset-0 opacity-55" aria-hidden="true">
            <div className="grid h-full grid-cols-2 gap-4 p-6 sm:grid-cols-4 lg:grid-cols-6">
              {Array.from({ length: 18 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-md border border-white/15 bg-white/[0.04] p-4 shadow-soft"
                >
                  <div className="mb-4 h-2 w-16 rounded-full bg-cyan-300/70" />
                  <div className="space-y-2">
                    <div className="h-2 rounded-full bg-white/25" />
                    <div className="h-2 w-3/4 rounded-full bg-white/15" />
                    <div className="h-2 w-1/2 rounded-full bg-amber-200/40" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative mx-auto flex min-h-[72svh] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-6">
              <Badge variant="secondary" className="border-cyan-200 bg-cyan-50 text-cyan-900">
                Built for the AI-era trust problem
              </Badge>
              <div className="space-y-4">
                <h1 className="text-balance text-5xl font-semibold tracking-normal sm:text-6xl">
                  PersonaVault AI
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-200">
                  A personal identity, document vault, proof-pack sharing, and AI document
                  authenticity checker for students, applicants, creators, and professionals.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/login">Start securely</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                >
                  <Link href="/app">View MVP shell</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;

            return (
              <Card key={pillar.title}>
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <CardTitle>{pillar.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-muted-foreground">
                  {pillar.description}
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="border-y bg-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:px-8">
            <div className="space-y-3">
              <Badge variant="outline">MVP roadmap</Badge>
              <h2 className="text-3xl font-semibold tracking-normal">Trust workflows, not file chaos.</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Phase 1 establishes the foundation. The next passes add Supabase auth, private
                storage, proof-pack sharing, AI risk analysis, and audit logging.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {trustOutcomes.map((outcome) => {
                const Icon = outcome.icon;

                return (
                  <div key={outcome.label} className="rounded-md border bg-background p-4">
                    <Icon className="mb-3 h-5 w-5 text-primary" aria-hidden="true" />
                    <div className="text-sm font-medium">{outcome.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
