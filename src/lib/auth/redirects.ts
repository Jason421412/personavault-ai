const DEFAULT_APP_REDIRECT = "/app";

export function getSafeAppRedirect(value?: string | null) {
  if (!value || value.startsWith("//") || !value.startsWith("/app")) {
    return DEFAULT_APP_REDIRECT;
  }

  return value;
}
