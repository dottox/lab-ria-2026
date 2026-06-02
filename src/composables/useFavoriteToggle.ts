import { ref } from 'vue'
import { useFavoritesStore } from '@/stores/favorites'
import type { Favorite } from '@/stores/favorites'

export const useFavoriteToggle = () => {
  const favoritesStore = useFavoritesStore()

  const toggleFavorite = (favorite: Favorite) => {
    const isFav = favoritesStore.favorites.some(f => f.id === favorite.id)
    if (isFav) {
      favoritesStore.removeFavorite(favorite.id)
    } else {
      favoritesStore.addFavorite(favorite)
    }
  }

  const isFavorited = (id: string) => {
    return favoritesStore.favorites.some(f => f.id === id)
  }

  return {
    toggleFavorite,
    isFavorited,
  }
}
