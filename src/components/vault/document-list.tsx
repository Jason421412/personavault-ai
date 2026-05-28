"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, FileText, Trash2, Upload } from "lucide-react";

import { deleteDocument, type DeleteDocumentState } from "@/app/app/vault/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Database } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import {
  formatFileSize,
  formatUploadedAt,
  getFileKindLabel,
  getHashPreview,
} from "@/lib/vault/documents";

type DocumentRow = Database["public"]["Tables"]["documents"]["Row"];

type DocumentListProps = {
  documents: DocumentRow[];
};

const initialState: DeleteDocumentState = {
  status: "idle",
};

function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="ghost" size="sm" disabled={pending}>
      <Trash2 className="h-4 w-4" aria-hidden="true" />
      {pending ? "Deleting..." : "Delete"}
    </Button>
  );
}

export function DocumentList({ documents }: DocumentListProps) {
  const [deleteState, deleteAction] = useActionState(deleteDocument, initialState);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <CardTitle>Vault documents</CardTitle>
            <CardDescription>
              Private metadata only. Raw storage URLs are never shown here.
            </CardDescription>
          </div>
          <Badge variant="secondary">{documents.length} stored</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {deleteState.message ? (
          <div
            className={cn(
              "flex items-start gap-2 rounded-md border px-3 py-2 text-sm",
              deleteState.status === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-destructive/30 bg-destructive/10 text-destructive",
            )}
          >
            {deleteState.status === "success" ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            ) : (
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            )}
            <span>{deleteState.message}</span>
          </div>
        ) : null}

        {documents.length === 0 ? (
          <EmptyState
            icon={Upload}
            title="No documents yet"
            description="Upload your first credential, transcript, certificate, or identity proof to start building a private vault."
          />
        ) : (
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>SHA-256</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead className="text-right">Manage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell>
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                          <FileText className="h-4 w-4" aria-hidden="true" />
                        </div>
                        <span className="truncate font-medium">{document.file_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getFileKindLabel(document.file_type)}</TableCell>
                    <TableCell>{formatFileSize(document.file_size)}</TableCell>
                    <TableCell>
                      <code className="rounded bg-secondary px-2 py-1 text-xs">
                        {getHashPreview(document.sha256_hash)}
                      </code>
                    </TableCell>
                    <TableCell>{formatUploadedAt(document.created_at)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {document.visibility}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <form action={deleteAction} className="flex justify-end">
                        <input type="hidden" name="documentId" value={document.id} />
                        <DeleteButton />
                      </form>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
