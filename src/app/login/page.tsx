import { redirect } from "next/navigation";
import type { Route } from "next";

import { AuthForm } from "@/components/auth/auth-form";
import { SiteHeader } from "@/components/layout/site-header";
import { getSafeAppRedirect } from "@/lib/auth/redirects";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/validators/env";

export const dynamic = "force-dynamic";

type LoginPageProps = {
  searchParams: Promise<{
    redirectTo?: string | string[];
    error?: string | string[];
  }>;
};

const authErrorMessages: Record<string, string> = {
  supabase_not_configured:
    "Supabase Auth is not configured yet. Add your project URL and anon key to .env.local.",
  auth_callback_failed:
    "We could not finish the email confirmation flow. Please try signing in again.",
};

function getSearchValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const redirectTo = getSafeAppRedirect(getSearchValue(params.redirectTo));
  const authUnavailable = !isSupabaseConfigured();
  const errorKey = getSearchValue(params.error);
  const setupNotice = authUnavailable
    ? {
        tone: "error" as const,
        message: authErrorMessages.supabase_not_configured,
      }
    : undefined;
  const initialNotice =
    errorKey && authErrorMessages[errorKey]
      ? {
          tone: "error" as const,
          message: authErrorMessages[errorKey],
        }
      : setupNotice;

  if (!authUnavailable) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      redirect(redirectTo as Route);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_28rem] lg:px-8">
        <section className="max-w-2xl space-y-6">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-normal text-primary">
              Secure workspace access
            </p>
            <h1 className="text-balance text-4xl font-semibold tracking-normal sm:text-5xl">
              Sign in to manage verified proof with confidence.
            </h1>
            <p className="text-base leading-7 text-muted-foreground">
              PersonaVault uses Supabase Auth to keep the application shell private while public
              proof-pack and profile pages stay separate.
            </p>
          </div>
          <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
            {["Protected /app routes", "Email/password auth", "Server-side session checks"].map(
              (item) => (
                <div key={item} className="rounded-md border bg-white p-4">
                  {item}
                </div>
              ),
            )}
          </div>
        </section>

        <AuthForm
          authUnavailable={authUnavailable}
          initialNotice={initialNotice}
          redirectTo={redirectTo}
        />
      </main>
    </div>
  );
}
