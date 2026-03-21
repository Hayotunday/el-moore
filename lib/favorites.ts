// Simple external store for favorites
let favorites: string[] = [];
let listeners: Set<() => void> = new Set();

export const getFavorites = () => favorites;

export const toggleFavorite = (id: string) => {
  if (favorites.includes(id)) {
    favorites = favorites.filter((f) => f !== id);
  } else {
    favorites = [...favorites, id];
  }
  listeners.forEach((l) => l());
};

export const isFavorite = (id: string) => favorites.includes(id);

export const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
