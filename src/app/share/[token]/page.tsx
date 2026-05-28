import Link from "next/link";
import { CalendarClock, FileCheck2, ShieldCheck } from "lucide-react";

import { BrandMark } from "@/components/layout/brand-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SharePageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function SharePage({ params }: SharePageProps) {
  const { token } = await params;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <BrandMark />
          <Badge variant="secondary">Proof pack preview</Badge>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-white">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <Badge variant="outline">Token: {token}</Badge>
                <CardTitle className="mt-3 text-3xl">Shared proof pack placeholder</CardTitle>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  This page will validate expiry, load public-safe proof-pack metadata, and avoid
                  exposing raw private storage URLs.
                </p>
              </div>
              <Badge variant="success">
                <ShieldCheck className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                Trust controls planned
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 p-6 md:grid-cols-2">
            <div className="rounded-md border p-4">
              <FileCheck2 className="mb-3 h-5 w-5 text-primary" aria-hidden="true" />
              <div className="text-sm font-medium">Documents</div>
              <p className="mt-1 text-sm text-muted-foreground">
                Selected vault files will be listed with metadata and hashes.
              </p>
            </div>
            <div className="rounded-md border p-4">
              <CalendarClock className="mb-3 h-5 w-5 text-primary" aria-hidden="true" />
              <div className="text-sm font-medium">Expiry</div>
              <p className="mt-1 text-sm text-muted-foreground">
                Time-limited access will be enforced server-side.
              </p>
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
