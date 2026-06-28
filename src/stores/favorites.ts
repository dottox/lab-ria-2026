import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type FavoriteType = 'transport' | 'tourism' | 'event'

export interface Favorite {
  id: string
  type: FavoriteType
  title: string
  description: string
  savedAt: number
  route?: string
  slug?: string
}

const favoriteTypes: FavoriteType[] = ['transport', 'tourism', 'event']

const isFavoriteType = (type: unknown): type is FavoriteType => {
  return typeof type === 'string' && favoriteTypes.includes(type as FavoriteType)
}

const getStringField = (record: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    const value = record[key]
    if (typeof value === 'string' && value.trim()) {
      return value.trim()
    }
  }

  return ''
}

const inferFavoriteType = (record: Record<string, unknown>): FavoriteType | null => {
  if (isFavoriteType(record.type)) {
    return record.type
  }

  const id = typeof record.id === 'string' ? record.id : ''
  if (id.startsWith('dest-')) return 'tourism'
  if (id.startsWith('event-')) return 'event'
  if (id.startsWith('transport-') || id.startsWith('schedule-')) return 'transport'
  if ('region' in record || 'grid' in record || 'bestTime' in record) return 'tourism'
  if ('venueName' in record || 'neighborhood' in record || 'seasonLabel' in record) return 'event'
  if ('origin' in record || 'departure' in record || 'arrival' in record) return 'transport'

  return null
}

const normalizeFavorite = (item: unknown): Favorite | null => {
  if (!item || typeof item !== 'object') {
    return null
  }

  const record = item as Record<string, unknown>
  const id = getStringField(record, ['id'])
  const type = inferFavoriteType(record)

  if (!id || !type) {
    return null
  }

  const title = getStringField(record, ['title', 'name', 'company', 'line'])
  const description = getStringField(record, ['description', 'region', 'destination'])
  const route = getStringField(record, ['route'])
  const slug = getStringField(record, ['slug'])
  const savedAt = typeof record.savedAt === 'number' && Number.isFinite(record.savedAt)
    ? record.savedAt
    : Date.now()

  const favorite: Favorite = {
    id,
    type,
    title: title || 'Favorito guardado',
    description,
    savedAt,
  }

  if (route) {
    favorite.route = route
  }

  if (slug) {
    favorite.slug = slug
  }

  return favorite
}

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref<Favorite[]>([])

  // Load from localStorage on initialization
  const loadFavorites = () => {
    const stored = localStorage.getItem('favorites')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        const rawFavorites = Array.isArray(parsed) ? parsed : []
        favorites.value = rawFavorites
          .map(normalizeFavorite)
          .filter((favorite): favorite is Favorite => favorite !== null)
        saveFavoritesToStorage()
      } catch {
        favorites.value = []
        localStorage.removeItem('favorites')
      }
    }
  }

  const saveFavoritesToStorage = () => {
    localStorage.setItem('favorites', JSON.stringify(favorites.value))
  }

  const addFavorite = (favorite: Favorite) => {
    const normalizedFavorite = normalizeFavorite(favorite)
    if (normalizedFavorite && !favorites.value.find(f => f.id === normalizedFavorite.id)) {
      favorites.value.push(normalizedFavorite)
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
