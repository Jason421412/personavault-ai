import type { ReactNode } from "react";

import { AppSidebar } from "@/components/app/app-sidebar";

type AppShellProps = {
  children: ReactNode;
  userEmail: string;
};

export function AppShell({ children, userEmail }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen flex-col md:flex-row">
        <AppSidebar userEmail={userEmail} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
