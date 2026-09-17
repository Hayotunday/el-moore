import {
  apiFetch,
  toQueryString,
  uploadToPresignedUrl,
  toPublicR2Url,
  R2_PUBLIC_BASE_URL,
} from "./client";
import { customerApiFetch } from "./customer-auth";
import type { Property, PropertyImage, PropertyStatus, Sale } from "./types";

export interface PropertyWithSale extends Property {
  sale: Sale | null;
}

/** GET /properties has no join on the live API — cross-reference sales client-side. */
export function joinSaleToProperties(
  propertyList: Property[],
  saleList: Sale[],
): PropertyWithSale[] {
  return propertyList.map((property) => ({
    ...property,
    sale: saleList.find((s) => s.propertyId === property.id) ?? null,
  }));
}

export async function listProperties(
  status?: PropertyStatus,
): Promise<Property[]> {
  return apiFetch<Property[]>(`/properties${toQueryString({ status })}`);
}

/**
 * Not wired to any page yet — the Properties page currently composes its stats and table
 * from `listProperties()` + `joinSaleToProperties()`, which already works. This
 * purpose-built endpoint could replace that, but its response shape isn't documented and
 * hasn't been verified against a live authenticated call.
 */
export async function getPropertiesDashboard(params: {
  search?: string;
  status?: PropertyStatus;
  limit?: number;
  offset?: number;
}): Promise<unknown> {
  return apiFetch(
    `/properties/dashboard${toQueryString({
      search: params.search,
      status: params.status,
      limit: params.limit ? String(params.limit) : undefined,
      offset: params.offset ? String(params.offset) : undefined,
    })}`,
  );
}

/**
 * Public and works with no session — but routed through customerApiFetch
 * (not the plain apiFetch) so a signed-in customer's bearer token is
 * attached when present. The backend uses that to add `isFavorited` to
 * each property; an anonymous call gets the same list with that field
 * simply absent. Per the backend team: this is documented as `GET
 * /api/properties (authenticated)`, but that path is staff-role-gated
 * (confirmed: 401s with no token, and separately gated to OFFICE_ADMIN/
 * TEAM_LEAD/ACCOUNTANT) — /properties/public is the one this app can
 * actually reach as a customer, and it matches the described behavior
 * (isFavorited present iff authenticated). Worth re-confirming with them
 * which path is actually meant; update here if it turns out to be
 * /properties instead.
 */
export async function listPublicProperties(): Promise<Property[]> {
  return customerApiFetch<Property[]>("/properties/public");
}

/** Best-effort primary photo for a property card — falls back to null so a
 * card can render a placeholder rather than fail the whole list. */
export async function getPrimaryImageUrl(
  propertyId: string,
): Promise<string | null> {
  try {
    const images = await listPropertyImages(propertyId);
    return (
      images.find((img) => img.isPrimary)?.imageUrl ??
      images[0]?.imageUrl ??
      null
    );
  } catch {
    return null;
  }
}

/** Batch-resolves a primary image per property — one call per property, run
 * concurrently, so a listing grid never blocks entirely on one bad image. */
export async function getPrimaryImages(
  propertyIds: string[],
): Promise<Map<string, string | null>> {
  const entries = await Promise.all(
    propertyIds.map(async (id) => [id, await getPrimaryImageUrl(id)] as const),
  );
  return new Map(entries);
}

export async function getProperty(id: string): Promise<Property> {
  return apiFetch<Property>(`/properties/${id}`);
}

/** OFFICE_ADMIN only. */
export async function createProperty(input: {
  title: string;
  location: string;
  price: string;
  status?: PropertyStatus;
}): Promise<Property> {
  return apiFetch<Property>("/properties", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

/** OFFICE_ADMIN only. */
export async function updateProperty(
  id: string,
  input: Partial<Pick<Property, "title" | "location" | "price" | "status">>,
): Promise<Property> {
  return apiFetch<Property>(`/properties/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

/** OFFICE_ADMIN only. */
export async function deleteProperty(id: string): Promise<void> {
  await apiFetch<void>(`/properties/${id}`, { method: "DELETE" });
}

export async function listPropertyImages(
  propertyId: string,
): Promise<PropertyImage[]> {
  return apiFetch<PropertyImage[]>(`/properties/${propertyId}/images`);
}

/** OFFICE_ADMIN only. Uploads a file to R2 via a presigned URL, then confirms it. */
export async function uploadPropertyImage(
  propertyId: string,
  file: File,
): Promise<PropertyImage> {
  const {
    uploadUrl,
    image: { id },
  } = await apiFetch<{
    uploadUrl: string;
    image: { id: string };
  }>(`/properties/${propertyId}/images`, {
    method: "POST",
    body: JSON.stringify({ filename: file.name, contentType: file.type }),
  });
  await uploadToPresignedUrl(uploadUrl, file);
  return apiFetch<PropertyImage>(
    `/properties/${propertyId}/images/${id}/confirm`,
    {
      method: "POST",
      body: JSON.stringify({
        imageUrl: toPublicR2Url(uploadUrl, R2_PUBLIC_BASE_URL),
      }),
    },
  );
}

/** OFFICE_ADMIN only. */
export async function setPrimaryPropertyImage(
  propertyId: string,
  imageId: string,
): Promise<void> {
  await apiFetch<void>(
    `/properties/${propertyId}/images/${imageId}/set-primary`,
    {
      method: "PATCH",
    },
  );
}

/** OFFICE_ADMIN only. */
export async function removePropertyImage(
  propertyId: string,
  imageId: string,
): Promise<void> {
  await apiFetch<void>(`/properties/${propertyId}/images/${imageId}`, {
    method: "DELETE",
  });
}
