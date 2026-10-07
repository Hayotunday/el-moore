"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { listMyFavorites } from "@/lib/api/customer-portal";

/**
 * Just the count/list of the signed-in customer's favorited property IDs —
 * for the navbar badge and the profile page's "N saved properties" line.
 * Toggling a favorite from a property card no longer goes through this hook:
 * listPublicProperties() now attaches `isFavorited` to each property for a
 * signed-in customer, so PropertyCard (and the homepage's featured card)
 * read/flip that field directly and call addFavorite()/removeFavorite() from
 * lib/api/customer-portal.ts themselves, rather than sharing global toggle
 * state here.
 */
export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(user));

  useEffect(() => {
    if (!user) {
      return;
    }
    let cancelled = false;
    listMyFavorites()
      .then((properties) => {
        if (!cancelled) setFavorites(properties.map((p) => p.id));
      })
      .catch(() => {
        if (!cancelled) setFavorites([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  return { favorites, isLoading };
}
