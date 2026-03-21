import { useSyncExternalStore, useCallback } from "react";
import {
  getFavorites,
  toggleFavorite,
  isFavorite,
  subscribe,
} from "@/lib/favorites";

export function useFavorites() {
  const favorites = useSyncExternalStore(subscribe, getFavorites);

  const toggle = useCallback((id: string) => {
    toggleFavorite(id);
  }, []);

  const check = useCallback(
    (id: string) => {
      return favorites.includes(id);
    },
    [favorites],
  );

  return { favorites, toggle, isFavorite: check };
}
