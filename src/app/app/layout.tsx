import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/app/app-shell";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/validators/env";

export const dynamic = "force-dynamic";

export default async function ProtectedAppLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  if (!isSupabaseConfigured()) {
    redirect("/login?error=supabase_not_configured");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/app");
  }

  return <AppShell userEmail={user.email ?? "Signed in"}>{children}</AppShell>;
}
