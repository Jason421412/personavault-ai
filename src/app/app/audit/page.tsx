import { Clock3 } from "lucide-react";

import { PageShell } from "@/components/app/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const plannedEvents = [
  "profile.created",
  "document.uploaded",
  "proof_pack.created",
  "document_check.completed",
];

export default function AuditPage() {
  return (
    <PageShell
      title="Audit Timeline"
      description="Audit timeline placeholder for important profile, vault, sharing, and AI checker events."
    >
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {plannedEvents.map((event) => (
              <div key={event} className="flex gap-4 rounded-md border p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                  <Clock3 className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{event}</span>
                    <Badge variant="outline">Planned</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    This event will be inserted into audit_logs after the corresponding server
                    action is implemented.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
