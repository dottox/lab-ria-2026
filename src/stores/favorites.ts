import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Favorite {
  id: string
  type: 'transport' | 'tourism' | 'event'
  title: string
  description: string
  savedAt: number
}

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref<Favorite[]>([])

  // Load from localStorage on initialization
  const loadFavorites = () => {
    const stored = localStorage.getItem('favorites')
    if (stored) {
      favorites.value = JSON.parse(stored)
    }
  }

  const saveFavoritesToStorage = () => {
    localStorage.setItem('favorites', JSON.stringify(favorites.value))
  }

  const addFavorite = (favorite: Favorite) => {
    if (!favorites.value.find(f => f.id === favorite.id)) {
      favorites.value.push(favorite)
      saveFavoritesToStorage()
    }
  }

  const removeFavorite = (id: string) => {
    favorites.value = favorites.value.filter(f => f.id !== id)
    saveFavoritesToStorage()
  }

  const isFavorite = (id: string) => {
    return computed(() => favorites.value.some(f => f.id === id)).value
  }

  const clearFavorites = () => {
    favorites.value = []
    localStorage.removeItem('favorites')
  }

  loadFavorites()

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearFavorites,
  }
})
