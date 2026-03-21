import { useSyncExternalStore, useCallback } from "react";
import {
  getFavorites,
  toggleFavorite,
  isFavorite,
  subscribe,
} from "@/lib/favorites";

const SERVER_SNAPSHOT: string[] = [];
const getServerSnapshot = () => SERVER_SNAPSHOT;

export function useFavorites() {
  const favorites = useSyncExternalStore(
    subscribe,
    getFavorites,
    getServerSnapshot,
  );

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
