import { AlertCircle, ShieldCheck } from "lucide-react";

import { PageShell } from "@/components/app/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { DocumentList } from "@/components/vault/document-list";
import { DocumentUploadForm } from "@/components/vault/document-upload-form";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function VaultPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: documents, error } = await supabase
    .from("documents")
    .select(
      "id, user_id, file_name, file_type, file_size, storage_path, sha256_hash, visibility, created_at",
    )
    .eq("user_id", user?.id ?? "")
    .order("created_at", { ascending: false });

  return (
    <PageShell
      title="Document Vault"
      description="Upload important documents into private Supabase Storage, record tamper-evident SHA-256 hashes, and manage vault metadata."
    >
      <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-4">
          <DocumentUploadForm />
          <Card className="bg-secondary/40">
            <CardContent className="flex gap-3 p-5">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <div className="space-y-1">
                <h2 className="text-sm font-semibold">Private by default</h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  PersonaVault stores only metadata in the table view and keeps files in a private
                  bucket under your user-scoped folder.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {error ? (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="flex gap-3 p-5">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-hidden="true" />
              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-destructive">
                  Document table is not ready
                </h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  Run docs/supabase-schema.sql in Supabase SQL Editor, then refresh this page.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <DocumentList documents={documents ?? []} />
        )}
      </div>
    </PageShell>
  );
}
