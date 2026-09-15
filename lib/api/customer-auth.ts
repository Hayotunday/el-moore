import { API_BASE_URL, ApiError } from "./client";
import type { Customer } from "./types";

/**
 * A customer's own account is a *separate* identity from the generic "basic"
 * role signed in via lib/api/auth.ts's login()/registerUser() — this is the
 * purpose-built customer auth system, tied directly to the same Customer
 * record staff manage via lib/api/customers.ts (see the "claim" flow below).
 *
 * Not wired into any page yet — the existing signin/signup/profile pages
 * still use the old basic-role auth. Deliberately self-contained (own token
 * key, own fetch wrapper, own refresh endpoint) rather than extending
 * lib/api/client.ts's apiFetch(), so migrating the UI over later doesn't
 * require touching the one function every other integration depends on.
 */

const CUSTOMER_TOKEN_KEY = "el-moore-customer-token";

export function getCustomerToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(CUSTOMER_TOKEN_KEY);
}

export function setCustomerToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(CUSTOMER_TOKEN_KEY, token);
  else window.localStorage.removeItem(CUSTOMER_TOKEN_KEY);
}

const AUTH_EXPIRED_EVENT = "el-moore-customer-auth-expired";

/** Dispatched when the refresh itself fails, so a customer-auth context can
 *  clear its in-memory state immediately instead of leaving the UI looking
 *  signed in while every request 401s. */
export function onCustomerAuthExpired(handler: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(AUTH_EXPIRED_EVENT, handler);
  return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handler);
}

function announceAuthExpired() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
}

interface SuccessEnvelope<T> {
  data: T;
  success: true;
}

/** Mirrors lib/api/client.ts's unwrap() — most success responses are wrapped
 *  in `{ data, message, statusCode, success }`. */
function unwrap<T>(body: unknown): T {
  if (
    body &&
    typeof body === "object" &&
    "data" in body &&
    "success" in body &&
    (body as { success?: unknown }).success === true
  ) {
    return (body as SuccessEnvelope<T>).data;
  }
  return body as T;
}

function extractMessage(body: unknown, fallback: string): string {
  if (body && typeof body === "object" && "message" in body) {
    const message = (body as { message?: unknown }).message;
    if (Array.isArray(message)) return message.join(" ");
    if (typeof message === "string") return message;
  }
  return fallback;
}

interface RawTokenResponse {
  accessToken?: string;
  access_token?: string;
  token?: string;
}

function extractToken(raw: RawTokenResponse): string | null {
  return raw.accessToken ?? raw.access_token ?? raw.token ?? null;
}

let refreshInFlight: Promise<string | null> | null = null;

/**
 * Calls POST /customers/me/auth/refresh directly (not through
 * customerApiFetch, to avoid recursing back into the 401-retry below).
 * CustomerRefreshDto's only documented field is `accessToken` — presumably
 * the current (expiring) token, re-validated against the HttpOnly refresh
 * cookie set on login. Unconfirmed beyond the request shape, since the live
 * docs don't describe response bodies or refresh semantics.
 */
async function rawCustomerRefresh(): Promise<string | null> {
  const current = getCustomerToken();
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
    return extractToken(unwrap<RawTokenResponse>(JSON.parse(text)));
  } catch {
    return null;
  }
}

// Deduped so a burst of requests that all 401 at once triggers exactly one
// refresh call, not one per request — same reasoning as lib/api/client.ts.
function refreshCustomerOnce(): Promise<string | null> {
  if (!refreshInFlight) {
    refreshInFlight = rawCustomerRefresh()
      .then((newToken) => {
        setCustomerToken(newToken);
        if (!newToken) announceAuthExpired();
        return newToken;
      })
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
}

/**
 * Fetch wrapper scoped to the /customers/me/* customer-auth/portal endpoints
 * — see the module comment for why this doesn't share apiFetch(). Exported
 * so lib/api/customer-portal.ts (and projects.ts's customer-facing
 * functions) can call the same authenticated endpoints.
 */
export async function customerApiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  let token = getCustomerToken();

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

  if (res.status === 401 && token && path !== "/customers/me/auth/refresh") {
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

/* ---------- Auth ---------- */

export async function registerCustomer(input: {
  firstName: string;
  middleName?: string;
  /** Optional — a Customer record can represent a company. */
  lastName?: string;
  phone: string;
  email: string;
  password: string;
}): Promise<void> {
  await customerApiFetch<void>("/customers/me/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export interface CustomerLoginResult {
  customer: Customer;
  token: string;
}

export async function loginCustomer(
  email: string,
  password: string,
): Promise<CustomerLoginResult> {
  const raw = await customerApiFetch<RawTokenResponse & { customer?: Customer; user?: Customer }>(
    "/customers/me/auth/login",
    { method: "POST", body: JSON.stringify({ email, password }) },
  );
  const token = extractToken(raw);
  if (!token) throw new Error("Login response did not include an access token.");
  setCustomerToken(token);
  const customer = raw.customer ?? raw.user ?? (await getCustomerProfile());
  return { customer, token };
}

export async function getCustomerProfile(): Promise<Customer> {
  return customerApiFetch<Customer>("/customers/me/auth/me");
}

export async function logoutCustomer(): Promise<void> {
  try {
    await customerApiFetch<void>("/customers/me/auth/logout", { method: "POST" });
  } finally {
    // Local session is cleared regardless of whether the server call succeeds.
    setCustomerToken(null);
  }
}

export async function verifyCustomerCode(input: { email: string; code: string }): Promise<void> {
  await customerApiFetch<void>("/customers/me/auth/verify-code", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function resendCustomerVerification(email: string): Promise<void> {
  await customerApiFetch<void>("/customers/me/auth/resend-verification", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

/**
 * Lets the signup form check whether an email already has a staff-created
 * Customer record before registering, so it can offer "claim this account"
 * instead of failing on a duplicate-email error. Response shape beyond a
 * boolean-ish result isn't documented.
 */
export async function checkCustomerEmailExists(email: string): Promise<boolean> {
  const res = await customerApiFetch<{ exists?: boolean } | boolean>(
    "/customers/me/auth/check-email",
    { method: "POST", body: JSON.stringify({ email }) },
  );
  return typeof res === "boolean" ? res : Boolean(res?.exists);
}

/**
 * Sets a password on a Customer record staff already created (e.g. during an
 * in-person sale) so that customer can log in online for the first time.
 */
export async function claimCustomerAccount(input: {
  email: string;
  password: string;
}): Promise<void> {
  await customerApiFetch<void>("/customers/me/auth/claim", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
