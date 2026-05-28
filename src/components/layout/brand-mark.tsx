import Link from "next/link";
import type { Route } from "next";
import { ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  href?: Route;
};

export function BrandMark({ className, href = "/" }: BrandMarkProps) {
  return (
    <Link href={href} className={cn("flex items-center gap-3", className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
        <ShieldCheck className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="text-base font-semibold tracking-normal">PersonaVault AI</span>
    </Link>
  );
}
