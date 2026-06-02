<template>
  <div class="tourism-page">
    <div class="container--main">
      <h1 class="page-title">Tourism in Uruguay</h1>
      <p class="page-subtitle">Explore popular destinations and attractions</p>

      <div class="destinations-grid">
        <div v-for="destination in destinations" :key="destination.id" class="destination-card">
          <Card :title="destination.name" :description="destination.region">
            <template #header>
              <div class="card-header">
                <div class="icon">{{ destination.icon }}</div>
                <button
                  class="fav-btn"
                  :class="{ 'fav-btn--active': isFavorited(destination.id) }"
                  @click="toggleFavorite(destination)"
                >
                  {{ isFavorited(destination.id) ? '⭐' : '☆' }}
                </button>
              </div>
            </template>

            <div class="destination-details">
              <p class="description">{{ destination.description }}</p>
              <div class="highlights">
                <span v-for="highlight in destination.highlights" :key="highlight" class="badge badge--accent">
                  {{ highlight }}
                </span>
              </div>
              <div class="meta-info">
                <div class="meta-item">
                  <strong>Best Time:</strong> {{ destination.bestTime }}
                </div>
                <div class="meta-item">
                  <strong>Distance from Montevideo:</strong> {{ destination.distance }}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useFavoriteToggle } from '@/composables/useFavoriteToggle'
import Card from '@/components/Card.vue'
import type { Favorite } from '@/stores/favorites'

interface Destination {
  id: string
  name: string
  region: string
  icon: string
  description: string
  highlights: string[]
  bestTime: string
  distance: string
}

const { toggleFavorite, isFavorited } = useFavoriteToggle()

const destinations = ref<Destination[]>([
  {
    id: 'dest-1',
    name: 'Punta del Este',
    region: 'Maldonado Department',
    icon: '🏖️',
    description: 'A world-famous beach resort known for its luxury amenities, nightlife, and stunning coastal scenery. Perfect for relaxation and water sports.',
    highlights: ['Casapueblo', 'Marina', 'Shopping'],
    bestTime: 'December to February',
    distance: '139 km',
  },
  {
    id: 'dest-2',
    name: 'Colonia del Sacramento',
    region: 'Colonia Department',
    icon: '🏛️',
    description: 'A UNESCO World Heritage site with charming colonial architecture, cobblestone streets, and historical significance dating back centuries.',
    highlights: ['Historic Town', 'River Views', 'Museums'],
    bestTime: 'March to May',
    distance: '177 km',
  },
  {
    id: 'dest-3',
    name: 'Montevideo',
    region: 'Capital',
    icon: '🏙️',
    description: 'Uruguay\'s vibrant capital city offering museums, cultural activities, local cuisine, and the iconic Rambla waterfront promenade.',
    highlights: ['Rambla', 'Theater', 'Markets'],
    bestTime: 'Year-round',
    distance: 'N/A',
  },
  {
    id: 'dest-4',
    name: 'Rocha Department',
    region: 'Eastern Coast',
    icon: '🌊',
    description: 'A pristine coastal region with beautiful beaches, lagoons, and natural reserves. Perfect for nature lovers and birdwatchers.',
    highlights: ['Beaches', 'Wildlife', 'Lagoons'],
    bestTime: 'September to November',
    distance: '250 km',
  },
  {
    id: 'dest-5',
    name: 'Salto',
    region: 'Northern Uruguay',
    icon: '💧',
    description: 'Known for its famous thermal spas and hot springs. A relaxing destination perfect for wellness and natural therapies.',
    highlights: ['Thermal Spas', 'Hot Springs', 'Nature'],
    bestTime: 'June to August',
    distance: '496 km',
  },
  {
    id: 'dest-6',
    name: 'Carmelo',
    region: 'West Coast',
    icon: '🍷',
    description: 'A charming small town famous for wine production, local restaurants, and scenic countryside views along the Río de la Plata.',
    highlights: ['Wineries', 'Restaurants', 'River'],
    bestTime: 'April to November',
    distance: '210 km',
  },
])

const createFavorite = (destination: Destination): Favorite => ({
  id: destination.id,
  type: 'tourism',
  title: destination.name,
  description: destination.region,
  savedAt: Date.now(),
})
</script>

<style scoped>
.tourism-page {
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

.destinations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.destination-card {
  display: contents;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.icon {
  font-size: 2rem;
}

.fav-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  transition: transform 0.2s ease;
}

.fav-btn:hover {
  transform: scale(1.2);
}

.fav-btn--active {
  color: var(--color-accent);
}

.destination-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.description {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--color-foreground);
}

.highlights {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.badge {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.85rem;
  font-weight: 500;
}

.badge--accent {
  background-color: var(--color-accent-light);
  color: var(--color-accent);
}

.meta-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.meta-item {
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.meta-item strong {
  color: var(--color-foreground);
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
  }

  .destinations-grid {
    grid-template-columns: 1fr;
  }
}
</style>
