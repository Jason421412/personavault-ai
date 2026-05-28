"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, LockKeyhole, Upload } from "lucide-react";

import { uploadDocument, type UploadDocumentState } from "@/app/app/vault/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { MAX_DOCUMENT_SIZE_BYTES } from "@/lib/validators/document";
import { formatFileSize } from "@/lib/vault/documents";

const initialState: UploadDocumentState = {
  status: "idle",
};

function UploadButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      <Upload className="h-4 w-4" aria-hidden="true" />
      {pending ? "Uploading..." : "Upload document"}
    </Button>
  );
}

export function DocumentUploadForm() {
  const [state, formAction] = useActionState(uploadDocument, initialState);

  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
            <LockKeyhole className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <CardTitle>Upload to private vault</CardTitle>
            <CardDescription>
              PDF, PNG, JPG, and JPEG files up to {formatFileSize(MAX_DOCUMENT_SIZE_BYTES)}.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="document-file">Document file</Label>
            <Input
              id="document-file"
              name="file"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
              aria-describedby="document-file-help"
              required
            />
            <p id="document-file-help" className="text-xs text-muted-foreground">
              Files are stored in a private Supabase Storage bucket and tracked with a SHA-256 hash.
            </p>
            {state.fieldErrors?.file ? (
              <p className="text-sm font-medium text-destructive">{state.fieldErrors.file}</p>
            ) : null}
          </div>

          {state.message ? (
            <div
              className={cn(
                "flex items-start gap-2 rounded-md border px-3 py-2 text-sm",
                state.status === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-destructive/30 bg-destructive/10 text-destructive",
              )}
            >
              {state.status === "success" ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              ) : (
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              )}
              <span>{state.message}</span>
            </div>
          ) : null}

          <div className="flex justify-end">
            <UploadButton />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
