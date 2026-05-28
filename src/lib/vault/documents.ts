export function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const units = ["KB", "MB", "GB"] as const;
  let size = bytes / 1024;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(size >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}

export function formatUploadedAt(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function getHashPreview(hash: string) {
  return `${hash.slice(0, 12)}...${hash.slice(-8)}`;
}

export function getFileKindLabel(fileType: string) {
  if (fileType === "application/pdf") {
    return "PDF";
  }

  if (fileType === "image/png") {
    return "PNG";
  }

  if (fileType === "image/jpeg") {
    return "JPEG";
  }

  return fileType || "Document";
}
