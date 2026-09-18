import { customerApiFetch } from "./customer-auth";
import type { InstallmentPlan, Property, Sale, SaleDocument } from "./types";

/**
 * Authenticated-customer self-service endpoints under /customers/me/* — favorites,
 * purchase history, and sale documents. Not wired into any page yet; hooks/useFavorites.ts
 * remains the localStorage-only favorites store used by the current (unauthenticated-
 * friendly) UI. This is ready to build a signed-in "server-synced favorites" experience
 * against once customer auth (lib/api/customer-auth.ts) is wired into the UI.
 */

export interface FavoriteItem {
  id: string;
  property: Property;
  addedAt?: string;
}

/**
 * Returns all favorited properties for the authenticated customer.
 * Normalizes the backend response ({ id, property: {...}, addedAt }[]) into standard Property objects.
 */
export async function listMyFavorites(): Promise<Property[]> {
  const res = await customerApiFetch<Array<Property | FavoriteItem>>(
    "/customers/me/favorites",
  );
  if (!Array.isArray(res)) return [];
  return res.map((item) => {
    if ("property" in item && item.property) {
      return {
        ...item.property,
        price: String(item.property.price ?? ""),
        isFavorited: true,
      };
    }
    const prop = item as Property;
    return {
      ...prop,
      price: String(prop.price ?? ""),
      isFavorited: true,
    };
  });
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
