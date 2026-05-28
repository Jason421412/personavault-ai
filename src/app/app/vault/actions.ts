"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/validators/env";
import { deleteDocumentSchema, documentUploadSchema } from "@/lib/validators/document";

const DOCUMENTS_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "documents";

export type UploadDocumentState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: {
    file?: string;
  };
};

export type DeleteDocumentState = {
  status: "idle" | "success" | "error";
  message?: string;
};

function getUploadFieldErrors(error: ReturnType<typeof documentUploadSchema.safeParse>["error"]) {
  const fileError = error?.issues.find((issue) => issue.path[0] === "file");

  return fileError ? { file: fileError.message } : undefined;
}

function getSafeFileName(fileName: string) {
  const normalizedName = fileName
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^\.+/, "")
    .replace(/[.-]+$/, "")
    .toLowerCase();

  return normalizedName.slice(0, 120) || "document";
}

function getStoragePath(userId: string, fileName: string) {
  return `${userId}/${Date.now()}-${getSafeFileName(fileName)}`;
}

async function getSha256Hash(file: File) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function uploadDocument(
  _previousState: UploadDocumentState,
  formData: FormData,
): Promise<UploadDocumentState> {
  if (!isSupabaseConfigured()) {
    return {
      status: "error",
      message: "Supabase is not configured. Add your env values before uploading documents.",
    };
  }

  const parsed = documentUploadSchema.safeParse({
    file: formData.get("file"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please choose a supported document before uploading.",
      fieldErrors: getUploadFieldErrors(parsed.error),
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: "error",
      message: "Your session expired. Please sign in again before uploading.",
    };
  }

  const file = parsed.data.file;
  const storagePath = getStoragePath(user.id, file.name);
  const sha256Hash = await getSha256Hash(file);

  const { error: storageError } = await supabase.storage.from(DOCUMENTS_BUCKET).upload(
    storagePath,
    file,
    {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    },
  );

  if (storageError) {
    return {
      status: "error",
      message:
        storageError.message ||
        "Could not upload the document. Confirm the private documents bucket exists.",
    };
  }

  const { data: savedDocument, error: documentError } = await supabase
    .from("documents")
    .insert({
      user_id: user.id,
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      storage_path: storagePath,
      sha256_hash: sha256Hash,
      visibility: "private",
    })
    .select()
    .single();

  if (documentError || !savedDocument) {
    await supabase.storage.from(DOCUMENTS_BUCKET).remove([storagePath]);

    return {
      status: "error",
      message:
        documentError?.message ||
        "The document uploaded, but metadata could not be saved. Storage cleanup was attempted.",
    };
  }

  const { error: auditError } = await supabase.from("audit_logs").insert({
    user_id: user.id,
    action: "DOCUMENT_UPLOADED",
    entity_type: "document",
    entity_id: savedDocument.id,
    metadata: {
      file_name: savedDocument.file_name,
      file_size: savedDocument.file_size,
      sha256_hash: savedDocument.sha256_hash,
    },
  });

  revalidatePath("/app");
  revalidatePath("/app/vault");
  revalidatePath("/app/audit");

  if (auditError) {
    return {
      status: "error",
      message:
        "Document uploaded, but the audit event could not be recorded. Check the audit_logs table policy.",
    };
  }

  return {
    status: "success",
    message: "Document uploaded and hashed.",
  };
}

export async function deleteDocument(
  _previousState: DeleteDocumentState,
  formData: FormData,
): Promise<DeleteDocumentState> {
  if (!isSupabaseConfigured()) {
    return {
      status: "error",
      message: "Supabase is not configured. Add your env values before deleting documents.",
    };
  }

  const parsed = deleteDocumentSchema.safeParse({
    documentId: formData.get("documentId"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Invalid document selected.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: "error",
      message: "Your session expired. Please sign in again before deleting.",
    };
  }

  const { data: document, error: loadError } = await supabase
    .from("documents")
    .select("id, file_name, storage_path, sha256_hash")
    .eq("id", parsed.data.documentId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (loadError) {
    return {
      status: "error",
      message: loadError.message || "Could not load that document.",
    };
  }

  if (!document) {
    return {
      status: "error",
      message: "Document not found, or you do not have access to it.",
    };
  }

  const { error: deleteRowError } = await supabase
    .from("documents")
    .delete()
    .eq("id", document.id)
    .eq("user_id", user.id);

  if (deleteRowError) {
    return {
      status: "error",
      message: deleteRowError.message || "Could not delete the document metadata.",
    };
  }

  const { error: storageError } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .remove([document.storage_path]);

  const { error: auditError } = await supabase.from("audit_logs").insert({
    user_id: user.id,
    action: "DOCUMENT_DELETED",
    entity_type: "document",
    entity_id: document.id,
    metadata: {
      file_name: document.file_name,
      sha256_hash: document.sha256_hash,
      storage_removed: !storageError,
    },
  });

  revalidatePath("/app");
  revalidatePath("/app/vault");
  revalidatePath("/app/audit");

  if (auditError) {
    return {
      status: "error",
      message:
        "Document deleted, but the audit event could not be recorded. Check the audit_logs table policy.",
    };
  }

  if (storageError) {
    return {
      status: "success",
      message:
        "Document metadata deleted. The private storage object could not be removed automatically.",
    };
  }

  return {
    status: "success",
    message: "Document deleted.",
  };
}
