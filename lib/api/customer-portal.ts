import { customerApiFetch } from "./customer-auth";
import type { InstallmentPlan, Property, Sale, SaleDocument } from "./types";

/**
 * Authenticated-customer self-service endpoints under /customers/me/* — favorites,
 * purchase history, and sale documents. Not wired into any page yet; hooks/useFavorites.ts
 * remains the localStorage-only favorites store used by the current (unauthenticated-
 * friendly) UI. This is ready to build a signed-in "server-synced favorites" experience
 * against once customer auth (lib/api/customer-auth.ts) is wired into the UI.
 */

/** Response shape (bare Property objects vs. {propertyId, ...}[]) isn't documented —
 *  assuming the joined Property list, since that's the more directly useful shape. */
export async function listMyFavorites(): Promise<Property[]> {
  return customerApiFetch<Property[]>("/customers/me/favorites");
}

export async function addFavorite(propertyId: string): Promise<void> {
  await customerApiFetch<void>(`/customers/me/favorites/${propertyId}`, { method: "POST" });
}

export async function removeFavorite(propertyId: string): Promise<void> {
  await customerApiFetch<void>(`/customers/me/favorites/${propertyId}`, { method: "DELETE" });
}

/** Properties linked to a sale the authenticated customer has made. */
export async function listMyProperties(): Promise<Property[]> {
  return customerApiFetch<Property[]>("/customers/me/properties");
}

export async function listMySales(): Promise<Sale[]> {
  return customerApiFetch<Sale[]>("/customers/me/sales");
}

export async function listMySaleDocuments(saleId: string): Promise<SaleDocument[]> {
  return customerApiFetch<SaleDocument[]>(`/customers/me/sales/${saleId}/documents`);
}

/** Response shape isn't documented — likely an InstallmentPlan-shaped summary plus
 *  amountPaid/balance, mirroring what lib/api/sales.ts's SaleWithDetails computes
 *  client-side for staff, but passed through as-is rather than guessed at. */
export async function getMyInstallmentStatus(
  saleId: string,
): Promise<InstallmentPlan | unknown> {
  return customerApiFetch(`/customers/me/sales/${saleId}/installment-status`);
}
