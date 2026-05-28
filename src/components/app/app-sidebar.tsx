"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Route } from "next";
import {
  Bot,
  Clock3,
  FileCheck2,
  FolderLock,
  LayoutDashboard,
  Loader2,
  LogOut,
  Mail,
  Share2,
  UserRoundCheck,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

import { BrandMark } from "@/components/layout/brand-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type NavItem = {
  title: string;
  href: Route;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/app",
    icon: LayoutDashboard,
  },
  {
    title: "Verified Profile",
    href: "/app/profile",
    icon: UserRoundCheck,
  },
  {
    title: "Document Vault",
    href: "/app/vault",
    icon: FolderLock,
  },
  {
    title: "Proof Packs",
    href: "/app/proof-packs",
    icon: Share2,
  },
  {
    title: "AI Checker",
    href: "/app/checker",
    icon: Bot,
  },
  {
    title: "Audit Timeline",
    href: "/app/audit",
    icon: Clock3,
  },
];

type AppSidebarProps = {
  userEmail: string;
};

export function AppSidebar({ userEmail }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | undefined>();

  async function handleSignOut() {
    setIsSigningOut(true);
    setSignOutError(undefined);

    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      setSignOutError(error.message);
      setIsSigningOut(false);
      return;
    }

    router.refresh();
    router.push("/login");
  }

  return (
    <aside className="border-b bg-white/80 md:sticky md:top-0 md:h-screen md:w-72 md:shrink-0 md:border-b-0 md:border-r">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-between px-4 md:px-5">
          <BrandMark href="/app" />
          <Badge variant="secondary" className="hidden md:inline-flex">
            MVP
          </Badge>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-4 pb-4 md:flex-1 md:flex-col md:overflow-visible md:px-3 md:py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || (item.href !== "/app" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-w-fit items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:min-w-0",
                  isActive && "bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
        <div className="border-t p-4">
          <div className="mb-3 rounded-md border bg-white p-3">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-normal text-muted-foreground">
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              Signed in as
            </div>
            <div className="truncate text-sm font-medium text-foreground" title={userEmail}>
              {userEmail}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3 w-full"
              onClick={handleSignOut}
              disabled={isSigningOut}
            >
              {isSigningOut ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <LogOut className="h-4 w-4" aria-hidden="true" />
              )}
              {isSigningOut ? "Signing out" : "Log out"}
            </Button>
            {signOutError ? (
              <p className="mt-2 text-xs text-destructive" role="alert">
                {signOutError}
              </p>
            ) : null}
          </div>
          <div className="hidden rounded-md bg-muted p-3 text-xs text-muted-foreground md:block">
            <div className="mb-1 flex items-center gap-2 font-medium text-foreground">
              <FileCheck2 className="h-4 w-4" aria-hidden="true" />
              Phase 2 auth
            </div>
            Business modules remain placeholders while protected routing is active.
          </div>
        </div>
      </div>
    </aside>
  );
}
