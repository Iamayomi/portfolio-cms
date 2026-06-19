import { BASE_URL } from "../constants";

export const AUTH_ROUTES = ["/auth/login", "/auth/error"] as const;

export const PUBLIC_ROUTES = [
  "/api/auth",
  "/api/public",
  "/api/webhooks",
] as const;

export const DEFAULT_AUTH_REDIRECT = "/";

export function isAuthRoute(pathname: string) {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

export function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}

export function getSafeCallbackUrl(value?: string | null) {
  if (!value) return DEFAULT_AUTH_REDIRECT;

  try {
    const url = new URL(value, BASE_URL);
    if (url.origin !== BASE_URL) return DEFAULT_AUTH_REDIRECT;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return DEFAULT_AUTH_REDIRECT;
  }
}
