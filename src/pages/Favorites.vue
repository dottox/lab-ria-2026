<template>
  <div class="favorites-page">
    <div class="container--main">
      <h1 class="page-title">My Favorites</h1>
      <p class="page-subtitle">Your saved items and preferences</p>

      <div v-if="favorites.length === 0" class="empty-state">
        <div class="empty-icon">⭐</div>
        <h2>No Favorites Yet</h2>
        <p>Start exploring and add items to your favorites to see them here!</p>
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
            Clear All
          </button>
        </div>

        <div class="favorites-grid">
          <div v-for="item in filteredFavorites" :key="item.id" class="favorite-item">
            <Card>
              <template #header>
                <div class="item-header">
                  <div class="item-meta">
                    <h3 class="item-title">{{ item.title }}</h3>
                    <p class="item-subtitle">{{ item.description }}</p>
                  </div>
                  <button
                    class="remove-btn"
                    @click="removeFavorite(item.id)"
                    title="Remove from favorites"
                  >
                    ✕
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
                  <span class="label">Added:</span> {{ formatDate(item.savedAt) }}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useFavoritesStore } from '@/stores/favorites'
import Card from '@/components/Card.vue'
import type { Favorite } from '@/stores/favorites'

const favoritesStore = useFavoritesStore()
const activeFilter = ref<'all' | 'transport' | 'tourism' | 'event'>('all')

const favorites = computed(() => favoritesStore.favorites)
const types: ('all' | 'transport' | 'tourism' | 'event')[] = ['all', 'transport', 'tourism', 'event']

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
    all: 'All',
    transport: 'Transport',
    tourism: 'Tourism',
    event: 'Events',
  }
  return labels[type] || type
}

const removeFavorite = (id: string) => {
  favoritesStore.removeFavorite(id)
}

const clearAll = () => {
  if (confirm('Are you sure you want to clear all favorites?')) {
    favoritesStore.clearFavorites()
  }
}

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp)
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
  padding: 2rem 0;
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

.favorite-item {
  display: contents;
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

.badge--transport {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
}

.badge--tourism {
  background-color: var(--color-accent-light);
  color: var(--color-accent);
}

.badge--event {
  background-color: #fee;
  color: var(--color-error);
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
