import {
  apiFetch,
  getStoredToken,
  setStoredToken,
  onAuthExpired,
  extractToken,
  unwrap,
  refreshCustomerOnce,
  type RawTokenResponse,
} from "./client";
import type { Customer } from "./types";

export const getCustomerToken = getStoredToken;
export const setCustomerToken = setStoredToken;
export const onCustomerAuthExpired = onAuthExpired;
export const customerApiFetch = apiFetch;
export { refreshCustomerOnce };

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
  await apiFetch<void>("/customers/me/auth/register", {
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
  const raw = await apiFetch<
    RawTokenResponse & {
      customer?: Customer;
      user?: Customer;
      data?: { accessToken?: string; customer?: Customer; user?: Customer };
    }
  >("/customers/me/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  const token = extractToken(raw);
  if (!token) {
    throw new Error("Login response did not include an access token.");
  }

  // Set the token immediately so any subsequent calls (like profile fetch) include it
  setCustomerToken(token);

  const unwrapped = unwrap<Record<string, unknown>>(raw);
  const candidateCustomer =
    (unwrapped?.customer as Customer | undefined) ??
    (unwrapped?.user as Customer | undefined) ??
    ((raw as Record<string, unknown>)?.customer as Customer | undefined) ??
    ((raw as Record<string, unknown>)?.user as Customer | undefined);

  const customer = candidateCustomer ?? (await getCustomerProfile());
  return { customer, token };
}

export async function getCustomerProfile(): Promise<Customer> {
  return apiFetch<Customer>("/customers/me/auth/me");
}

/**
 * Updates the authenticated customer's own profile — first/middle/last name,
 * phone, and date of birth.
 */
export async function updateMyProfile(input: {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
}): Promise<Customer> {
  return apiFetch<Customer>("/customers/me/profile", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function logoutCustomer(): Promise<void> {
  try {
    await apiFetch<void>("/customers/me/auth/logout", {
      method: "POST",
    });
  } finally {
    // Local session is cleared regardless of whether the server call succeeds.
    setCustomerToken(null);
  }
}

export async function verifyCustomerCode(input: {
  email: string;
  code: string;
}): Promise<void> {
  await apiFetch<void>("/customers/me/auth/verify-code", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function resendCustomerVerification(email: string): Promise<void> {
  await apiFetch<void>("/customers/me/auth/resend-verification", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

/**
 * Lets the signup form check whether an email already has a staff-created
 * Customer record before registering, so it can offer "claim this account"
 * instead of failing on a duplicate-email error.
 */
export async function checkCustomerEmailExists(
  email: string,
): Promise<boolean> {
  const res = await apiFetch<{ exists?: boolean } | boolean>(
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
  await apiFetch<void>("/customers/me/auth/claim", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
