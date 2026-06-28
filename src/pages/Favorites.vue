<template>
  <div class="favorites-page">
    <div class="container--main">
      <section v-if="isLoading" class="favorites-skeleton" aria-busy="true" aria-label="Cargando favoritos">
        <SkeletonBase width="14rem" height="2.25rem" radius="0.5rem" />
        <SkeletonBase width="18rem" height="1rem" radius="999px" />
        <div class="favorites-skeleton__filters">
          <SkeletonBase v-for="type in types" :key="`filter-${type}`" width="7rem" height="2.5rem" radius="0.5rem" />
        </div>
        <SkeletonGrid :items="3" :card-lines="2" with-actions />
      </section>

      <template v-else>
      <h1 class="page-title">Mis favoritos</h1>
      <p class="page-subtitle">Tus items guardados y preferencias</p>

      <div v-if="favorites.length === 0" class="empty-state">
        <div class="empty-icon">⭐</div>
        <h2>No hay favoritos todavía</h2>
        <p>Empieza a explorar y añade tus items para que aparezcan aquí!</p>
        <router-link to="/" class="btn--primary">Explore Uruguay</router-link>
      </div>

      <div v-else>
        <div class="filters">
          <button
            v-for="type in types"
            :key="type"
            class="filter-btn"
            :class="{ 'filter-btn--active': activeFilter === type }"
            @click="activeFilter = type"
          >
            {{ getTypeLabel(type) }}
            <span class="count">{{ getCount(type) }}</span>
          </button>
          <button
            v-if="favorites.length > 0"
            class="btn--secondary"
            @click="clearAll"
            style="margin-left: auto;"
          >
            Borrar todos
          </button>
        </div>

        <div class="favorites-grid">
          <RouterLink
            v-for="item in filteredFavorites"
            :key="item.id"
            class="favorite-card"
            :to="getFavoriteRoute(item)"
            :aria-label="`Abrir ${item.title}`"
          >
            <Card>
              <template #header>
                <div class="item-header">
                  <div class="item-meta">
                    <h3 class="item-title">{{ item.title }}</h3>
                    <p class="item-subtitle">{{ item.description }}</p>
                  </div>
                  <button
                    class="remove-btn"
                    type="button"
                    aria-label="Quitar de favoritos"
                    title="Quitar de favoritos"
                    @click.prevent.stop="removeFavorite(item.id)"
                  >
                    x
                  </button>
                </div>
              </template>

              <div class="item-details">
                <div class="item-type">
                  <span class="badge" :class="`badge--${item.type}`">
                    {{ getTypeLabel(item.type) }}
                  </span>
                </div>
                <div class="item-time">
                  <span class="label">Añadido:</span> {{ formatDate(item.savedAt) }}
                </div>
              </div>
            </Card>
          </RouterLink>
        </div>
      </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useFavoritesStore } from '@/stores/favorites'
import { tourismDepartments } from '@/data/tourism'
import Card from '@/components/Card.vue'
import { SkeletonBase, SkeletonGrid } from '@/components/skeleton'
import { useMinimumLoading } from '@/composables/useMinimumLoading'
import type { Favorite, FavoriteType } from '@/stores/favorites'

const favoritesStore = useFavoritesStore()
type FavoriteFilter = 'all' | FavoriteType

const activeFilter = ref<FavoriteFilter>('all')
const { isLoading } = useMinimumLoading(380)

const favorites = computed(() => favoritesStore.favorites)
const types: FavoriteFilter[] = ['all', 'transport', 'tourism', 'event']

const filteredFavorites = computed(() => {
  if (activeFilter.value === 'all') {
    return favorites.value
  }
  return favorites.value.filter(item => item.type === activeFilter.value)
})

const getCount = (type: string) => {
  if (type === 'all') {
    return favorites.value.length
  }
  return favorites.value.filter(item => item.type === type).length
}

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    all: 'Todos',
    transport: 'Transporte',
    tourism: 'Turismo',
    event: 'Eventos',
  }
  return labels[type] || type
}

const normalizeText = (value: string) => {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

const toSlug = (value: string) => {
  return normalizeText(value)
    .replace(/\u00f1/g, 'n')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const getTourismSlug = (favorite: Favorite) => {
  if (favorite.slug) {
    return favorite.slug
  }

  const normalizedTitle = normalizeText(favorite.title)
  const match = tourismDepartments.find(department =>
    department.id === favorite.id || normalizeText(department.name) === normalizedTitle
  )

  return match?.slug ?? toSlug(favorite.title)
}

const getFavoriteRoute = (favorite: Favorite) => {
  if (favorite.route?.startsWith('/')) {
    return favorite.route
  }

  if (favorite.type === 'tourism') {
    return `/tourism/${getTourismSlug(favorite)}`
  }

  if (favorite.type === 'event') {
    return `/events`
  }

  if (favorite.type === 'transport') {
    return '/events'
  }

  return '/favorites'
}

const removeFavorite = (id: string) => {
  favoritesStore.removeFavorite(id)
}

const clearAll = () => {
  if (confirm('Estás seguro que quieres limpiar todos tus favoritos?')) {
    favoritesStore.clearFavorites()
  }
}

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) {
    return 'Fecha no disponible'
  }

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped>
.favorites-page {
  padding: 6.5rem 0 4rem;
}

.favorites-skeleton {
  display: grid;
  gap: 1rem;
}

.favorites-skeleton__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: 1rem 0;
}

.page-title {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary);
}

.page-subtitle {
  margin: 0 0 2rem 0;
  font-size: 1rem;
  color: var(--color-text-muted);
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  background-color: var(--color-secondary-light);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.empty-icon {
  font-size: 3rem;
}

.empty-state h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  color: var(--color-foreground);
}

.empty-state p {
  margin: 0 0 1rem 0;
  color: var(--color-text-muted);
  max-width: 400px;
}

.empty-state a {
  text-decoration: none;
}

.filters {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background-color: var(--background);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.filter-btn--active {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.count {
  display: inline-block;
  min-width: 24px;
  height: 24px;
  padding: 0 6px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 24px;
  text-align: center;
}

.filter-btn--active .count {
  background-color: rgba(255, 255, 255, 0.3);
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 1.5rem;
}

.favorite-card {
  display: block;
  color: inherit;
  cursor: pointer;
  text-decoration: none;
  transition:
    transform var(--transition-base),
    filter var(--transition-base);
}

.favorite-card:hover {
  filter: drop-shadow(0 16px 28px rgba(56, 189, 248, 0.12));
  transform: translateY(-3px);
}

.favorite-card:focus-visible {
  border-radius: var(--radius-lg);
  outline: 2px solid #38bdf8;
  outline-offset: 4px;
}

.favorite-card :deep(.card) {
  height: 100%;
}

.favorite-card:hover :deep(.card),
.favorite-card:focus-visible :deep(.card) {
  border-color: rgba(56, 189, 248, 0.6);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.item-meta {
  flex: 1;
  min-width: 0;
}

.item-title {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  word-break: break-word;
}

.item-subtitle {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-text-muted);
  word-break: break-word;
}

.remove-btn {
  flex-shrink: 0;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  color: var(--color-error);
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.remove-btn:hover {
  opacity: 1;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.item-type {
  display: flex;
  gap: 0.5rem;
}

.badge {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.85rem;
  font-weight: 500;
}

.badge--transport,
.badge--tourism,
.badge--event {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
}

.item-time {
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.label {
  font-weight: 500;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
  }

  .filters {
    gap: 0.5rem;
  }

  .filter-btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  .favorites-grid {
    grid-template-columns: 1fr;
  }
}
</style>
