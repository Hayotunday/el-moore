"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useAuthDrawer } from "@/contexts/auth-drawer-context";
import {
  listMyFavorites,
  addFavorite,
  removeFavorite,
} from "@/lib/api/customer-portal";

export function useFavorites() {
  const { user } = useAuth();
  const { open: openAuthDrawer } = useAuthDrawer();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
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

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites],
  );

  const toggle = useCallback(
    async (id: string) => {
      if (!user) {
        openAuthDrawer("signin");
        return;
      }
      const wasFavorite = favorites.includes(id);
      // Optimistic update, rolled back if the request fails.
      setFavorites((prev) =>
        wasFavorite ? prev.filter((f) => f !== id) : [...prev, id],
      );
      try {
        if (wasFavorite) await removeFavorite(id);
        else await addFavorite(id);
      } catch {
        setFavorites((prev) =>
          wasFavorite ? [...prev, id] : prev.filter((f) => f !== id),
        );
      }
    },
    [user, favorites, openAuthDrawer],
  );

  return { favorites, toggle, isFavorite, isLoading };
}
