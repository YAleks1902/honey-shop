import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';

interface FavoritesState {
  favoriteIds: Set<string>;
  toggle: (productId: string, isLoggedIn: boolean) => Promise<void>;
  isFavorite: (productId: string) => boolean;
  setFavorites: (ids: string[]) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: new Set(),

      toggle: async (productId, isLoggedIn) => {
        const isFav = get().isFavorite(productId);
        set((state) => {
          const next = new Set(state.favoriteIds);
          if (isFav) next.delete(productId);
          else next.add(productId);
          return { favoriteIds: next };
        });

        if (isLoggedIn) {
          try {
            if (isFav) await api.delete(`/favorites/${productId}`);
            else await api.post(`/favorites/${productId}`);
          } catch {
            // Revert on error
            set((state) => {
              const next = new Set(state.favoriteIds);
              if (isFav) next.add(productId);
              else next.delete(productId);
              return { favoriteIds: next };
            });
          }
        }
      },

      isFavorite: (productId) => get().favoriteIds.has(productId),

      setFavorites: (ids) => set({ favoriteIds: new Set(ids) }),
    }),
    {
      name: 'honey-favorites',
      storage: {
        getItem: (name) => {
          const val = localStorage.getItem(name);
          if (!val) return null;
          const parsed = JSON.parse(val);
          return { ...parsed, state: { ...parsed.state, favoriteIds: new Set(parsed.state.favoriteIds ?? []) } };
        },
        setItem: (name, value) => {
          const serialized = { ...value, state: { ...value.state, favoriteIds: Array.from(value.state.favoriteIds) } };
          localStorage.setItem(name, JSON.stringify(serialized));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    },
  ),
);
