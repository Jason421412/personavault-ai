import { CalendarClock, FileCheck2, Share2 } from "lucide-react";

import { PageShell } from "@/components/app/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NewProofPackPage() {
  return (
    <PageShell
      title="New Proof Pack"
      description="Generator placeholder for selecting vault documents, setting a recipient label, choosing expiry, and applying a watermark."
      actions={
        <Button disabled>
          <Share2 className="h-4 w-4" aria-hidden="true" />
          Generate link
        </Button>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Pack details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input disabled placeholder="Internship verification pack" />
            </div>
            <div className="space-y-2">
              <Label>Recipient label</Label>
              <Input disabled placeholder="Acme Recruiting" />
            </div>
            <div className="space-y-2">
              <Label>Expiry</Label>
              <Input disabled placeholder="7 days" />
            </div>
            <div className="space-y-2">
              <Label>Watermark</Label>
              <Input disabled placeholder="Shared with Acme Recruiting" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Included documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-md border border-dashed p-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <FileCheck2 className="h-4 w-4" aria-hidden="true" />
                Vault selection pending
              </div>
              <Badge variant="outline">0 selected</Badge>
            </div>
            <div className="flex items-center gap-3 rounded-md border bg-muted p-3 text-sm text-muted-foreground">
              <CalendarClock className="h-4 w-4" aria-hidden="true" />
              Share-token generation and expiry validation will be server-side.
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
