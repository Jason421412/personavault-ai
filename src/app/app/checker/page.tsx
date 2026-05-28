import { AlertTriangle, Bot, CheckCircle2, ShieldAlert } from "lucide-react";

import { PageShell } from "@/components/app/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const previewSignals = [
  {
    icon: ShieldAlert,
    title: "Requests upfront payment",
    detail: "High severity",
  },
  {
    icon: AlertTriangle,
    title: "Urgency pressure",
    detail: "Medium severity",
  },
  {
    icon: CheckCircle2,
    title: "Recommended action",
    detail: "Verify through official channels",
  },
];

export default function CheckerPage() {
  return (
    <PageShell
      title="AI Document / Offer Checker"
      description="Server-side AI checker placeholder. The final route will accept text, validate it with Zod, call the AI provider server-side, and persist the structured report."
      actions={
        <Button disabled>
          <Bot className="h-4 w-4" aria-hidden="true" />
          Analyze
        </Button>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Suspicious text</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Label htmlFor="checker-input">Offer or document text</Label>
            <Textarea
              id="checker-input"
              disabled
              placeholder="Paste a suspicious job offer, recruiter message, scholarship notice, or document excerpt."
              className="min-h-64"
            />
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/70">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>Static risk report preview</CardTitle>
              <p className="mt-2 text-sm text-amber-900/75">
                The Phase 2 AI route will return strict JSON matching the product schema.
              </p>
            </div>
            <Badge variant="warning">HIGH</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md bg-white p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Risk score</span>
                <span className="text-2xl font-semibold text-amber-700">85</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div className="h-2 w-[85%] rounded-full bg-amber-500" />
              </div>
            </div>
            <div className="space-y-3">
              {previewSignals.map((signal) => {
                const Icon = signal.icon;

                return (
                  <div key={signal.title} className="flex gap-3 rounded-md bg-white p-3">
                    <Icon className="mt-0.5 h-4 w-4 text-amber-700" aria-hidden="true" />
                    <div>
                      <div className="text-sm font-medium">{signal.title}</div>
                      <div className="text-xs text-muted-foreground">{signal.detail}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
