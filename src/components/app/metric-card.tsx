import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type MetricCardProps = {
  title: string;
  value: string;
  caption: string;
  icon: LucideIcon;
};

export function MetricCard({ title, value, caption, icon: Icon }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold tracking-normal">{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{caption}</p>
      </CardContent>
    </Card>
  );
}
