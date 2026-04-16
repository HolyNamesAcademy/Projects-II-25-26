/**
 * Normalizes the `redirect` query param to a safe in-app path (no open redirects).
 */
export function getSafeRedirectPath(raw: string | null): string {
  if (raw == null || raw === "") return "/";
  let decoded: string;
  try {
    decoded = decodeURIComponent(raw.trim());
  } catch {
    return "/";
  }
  if (!decoded.startsWith("/") || decoded.startsWith("//")) return "/";
  return decoded;
}
