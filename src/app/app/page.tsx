import { Bot, Clock3, FolderLock, Share2 } from "lucide-react";

import { MetricCard } from "@/components/app/metric-card";
import { PageShell } from "@/components/app/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <PageShell
      title="Dashboard"
      description="A protected workspace overview for profile status, vault contents, proof packs, AI checks, and audit activity."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Documents" value="0" caption="Private vault items" icon={FolderLock} />
        <MetricCard title="Proof packs" value="0" caption="Active share links" icon={Share2} />
        <MetricCard title="AI checks" value="0" caption="Authenticity reports" icon={Bot} />
        <MetricCard title="Latest audit" value="None" caption="No events recorded" icon={Clock3} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Profile readiness</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {["Identity profile", "Document vault", "First proof pack", "Audit trail"].map(
              (item) => (
                <div key={item} className="flex items-center justify-between rounded-md border p-3">
                  <span className="text-sm font-medium">{item}</span>
                  <Badge variant="outline">Pending</Badge>
                </div>
              ),
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest audit event</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-dashed p-5 text-sm text-muted-foreground">
              Audit logging begins when auth-backed profile, vault, proof-pack, and checker actions
              are connected.
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
