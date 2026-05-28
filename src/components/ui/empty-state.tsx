import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <Card className="border-dashed bg-white/70">
      <CardContent className="flex flex-col items-center justify-center gap-4 px-6 py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold">{title}</h3>
          <p className="mx-auto max-w-md text-sm text-muted-foreground">{description}</p>
        </div>
        {action}
      </CardContent>
    </Card>
  );
}
