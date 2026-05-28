import { z } from "zod";

export const MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024;

export const allowedDocumentMimeTypes = [
  "application/pdf",
  "image/png",
  "image/jpeg",
] as const;

export const allowedDocumentExtensions = [".pdf", ".png", ".jpg", ".jpeg"] as const;

export const documentUploadSchema = z.object({
  file: z
    .custom<File>((value) => value instanceof File, "Choose a document to upload.")
    .refine((file) => file.size > 0, "Choose a non-empty document.")
    .refine(
      (file) => file.size <= MAX_DOCUMENT_SIZE_BYTES,
      "Documents must be 10 MB or smaller.",
    )
    .refine(
      (file) => allowedDocumentMimeTypes.includes(file.type as (typeof allowedDocumentMimeTypes)[number]),
      "Upload a PDF, PNG, JPG, or JPEG document.",
    )
    .refine((file) => {
      const fileName = file.name.toLowerCase();

      return allowedDocumentExtensions.some((extension) => fileName.endsWith(extension));
    }, "The file extension must be PDF, PNG, JPG, or JPEG."),
});

export const deleteDocumentSchema = z.object({
  documentId: z.string().uuid("Invalid document id."),
});
