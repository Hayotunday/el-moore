const DEFAULT_API_BASE_URL = "https://el-moore.onrender.com";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL;

export const R2_PUBLIC_BASE_URL =
  process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL ||
  "https://pub-7a398cb5a1604da7a1ff82accf47a10f.r2.dev";
export const R2_PRIVATE_BASE_URL =
  process.env.NEXT_PUBLIC_R2_PRIVATE_BASE_URL ||
  "https://pub-c96abe9a0fca4f158e5ff5a0d5b1f59b.r2.dev";

export function toPublicR2Url(
  presignedUploadUrl: string,
  publicBaseUrl: string,
): string {
  const path = presignedUploadUrl
    .split("?")[0]
    .replace(/^https?:\/\/[^/]+/, "");
  return `${publicBaseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
}

const TOKEN_KEY = "el-moore-customer-token";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

const AUTH_EXPIRED_EVENT = "el-moore-customer-auth-expired";

export function onAuthExpired(handler: () => void): () => void {
  if (typeof window === "undefined") return () => { };
  window.addEventListener(AUTH_EXPIRED_EVENT, handler);
  return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handler);
}

export function announceAuthExpired() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
}

export class ApiError extends Error {
  status: number;
  details?: unknown;
  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

function extractMessage(body: unknown, fallback: string): string {
  if (body && typeof body === "object" && "message" in body) {
    const message = (body as { message?: unknown }).message;
    if (Array.isArray(message)) return message.join(" ");
    if (typeof message === "string") return message;
  }
  return fallback;
}

interface SuccessEnvelope<T> {
  data: T;
  message?: string;
  statusCode?: number;
  success?: boolean;
}

/** Unwraps responses wrapped in standard API response envelopes ({ data, success, ... }). */
export function unwrap<T>(body: unknown): T {
  if (
    body &&
    typeof body === "object" &&
    "data" in body &&
    ((body as { success?: unknown }).success === true ||
      "statusCode" in body ||
      "message" in body)
  ) {
    return (body as SuccessEnvelope<T>).data;
  }
  return body as T;
}

export interface RawTokenResponse {
  accessToken?: string;
  access_token?: string;
  token?: string;
  [key: string]: unknown;
}

export function extractToken(raw: unknown): string | null {
  if (!raw || typeof raw !== "object") return null;
  const unwrapped = unwrap<RawTokenResponse>(raw);
  if (!unwrapped || typeof unwrapped !== "object") return null;
  return (
    unwrapped.accessToken ?? unwrapped.access_token ?? unwrapped.token ?? null
  );
}

/**
 * Calls POST /customers/me/auth/refresh directly using the current access token
 * and the HttpOnly refresh-token cookie set on login. Returns the new access token,
 * or null if the refresh token itself is invalid/expired.
 */
async function rawCustomerRefresh(): Promise<string | null> {
  const current = getStoredToken();
  if (!current) return null;
  try {
    const res = await fetch(`${API_BASE_URL}/api/customers/me/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken: current }),
    });
    if (!res.ok) return null;
    const text = await res.text();
    if (!text) return null;
    return extractToken(JSON.parse(text));
  } catch {
    return null;
  }
}

// Access-token refreshes are deduped so a burst of requests that all hit a 401
// at once triggers exactly one /customers/me/auth/refresh call, not one per request.
let refreshInFlight: Promise<string | null> | null = null;

export function refreshCustomerOnce(): Promise<string | null> {
  if (!refreshInFlight) {
    refreshInFlight = rawCustomerRefresh()
      .then((newToken) => {
        setStoredToken(newToken);
        if (!newToken) announceAuthExpired();
        return newToken;
      })
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  let token = getStoredToken();

  const send = (authToken: string | null) =>
    fetch(`${API_BASE_URL}/api${path}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...options.headers,
      },
    });

  let res = await send(token);

  if (
    res.status === 401 &&
    token &&
    path !== "/customers/me/auth/refresh" &&
    path !== "/customers/me/auth/login"
  ) {
    const refreshed = await refreshCustomerOnce();
    if (refreshed) {
      token = refreshed;
      res = await send(token);
    }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(extractMessage(body, res.statusText), res.status, body);
  }

  if (res.status === 204) return undefined as T;
  const text = await res.text();
  if (!text) return undefined as T;
  return unwrap<T>(JSON.parse(text));
}

export const customerApiFetch = apiFetch;

export async function uploadToPresignedUrl(
  url: string,
  file: File,
): Promise<void> {
  const absoluteUrl = /^https?:\/\//i.test(url)
    ? url
    : `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;

  const res = await fetch(absoluteUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });
  if (!res.ok) {
    throw new ApiError(`Upload failed (${res.status})`, res.status);
  }
}

export function toQueryString(
  params: Record<string, string | undefined>,
): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== "",
  );
  if (entries.length === 0) return "";
  return `?${new URLSearchParams(entries as [string, string][]).toString()}`;
}
