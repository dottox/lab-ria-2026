<template>
  <div class="events-page">
    <div class="container--main">
      <h1 class="page-title">Events in Uruguay</h1>
      <p class="page-subtitle">Stay updated with cultural and seasonal events</p>

      <div class="events-list">
        <div v-for="event in events" :key="event.id" class="event-card">
          <Card>
            <template #header>
              <div class="event-header">
                <div class="event-info">
                  <h3 class="event-title">{{ event.name }}</h3>
                  <span class="event-date">📅 {{ event.date }}</span>
                </div>
                <button
                  class="fav-btn"
                  :class="{ 'fav-btn--active': isFavorited(event.id) }"
                  @click="toggleFavorite(event)"
                >
                  {{ isFavorited(event.id) ? '⭐' : '☆' }}
                </button>
              </div>
            </template>

            <div class="event-details">
              <p class="event-description">{{ event.description }}</p>
              <div class="event-meta">
                <div class="meta-row">
                  <strong>Location:</strong> {{ event.location }}
                </div>
                <div class="meta-row">
                  <strong>Type:</strong>
                  <span class="badge badge--primary">{{ event.type }}</span>
                </div>
                <div class="meta-row">
                  <strong>Frequency:</strong> {{ event.frequency }}
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

interface Event {
  id: string
  name: string
  date: string
  description: string
  location: string
  type: string
  frequency: string
}

const { toggleFavorite, isFavorited } = useFavoriteToggle()

const events = ref<Event[]>([
  {
    id: 'event-1',
    name: 'Carnival of Montevideo',
    date: 'January - February',
    description: 'Uruguay\'s most famous celebration featuring elaborate parades, traditional murgas (comedic musical groups), and street parties throughout the capital.',
    location: 'Montevideo',
    type: 'Cultural Festival',
    frequency: 'Annual',
  },
  {
    id: 'event-2',
    name: 'International Festival of Nuevo Cine',
    date: 'October',
    description: 'A prestigious independent film festival showcasing innovative and experimental cinema from around the world.',
    location: 'Montevideo',
    type: 'Film Festival',
    frequency: 'Annual',
  },
  {
    id: 'event-3',
    name: 'National Book Fair',
    date: 'September - October',
    description: 'South America\'s largest book fair featuring thousands of titles, author signings, and literary discussions.',
    location: 'Parque Rodó, Montevideo',
    type: 'Cultural Event',
    frequency: 'Annual',
  },
  {
    id: 'event-4',
    name: 'Summer Music Festival',
    date: 'January - March',
    description: 'Open-air concerts featuring local and international artists performing various genres of music.',
    location: 'Multiple venues across Uruguay',
    type: 'Music Festival',
    frequency: 'Summer Season',
  },
  {
    id: 'event-5',
    name: 'Hipódromo de Maroñas Racing Season',
    date: 'September - April',
    description: 'Professional horse racing events held at one of the main racecourses in Montevideo.',
    location: 'Hipódromo de Maroñas',
    type: 'Sports',
    frequency: 'Seasonal',
  },
  {
    id: 'event-6',
    name: 'Noche de la Nostalgia',
    date: 'May',
    description: 'A celebration of tango culture featuring performances, dances, and tributes to traditional Uruguayan music.',
    location: 'Montevideo',
    type: 'Cultural',
    frequency: 'Annual',
  },
  {
    id: 'event-7',
    name: 'Independence Day Celebrations',
    date: 'August 25',
    description: 'National holiday celebrating Uruguay\'s independence with parades, civic ceremonies, and cultural performances.',
    location: 'Throughout Uruguay',
    type: 'National Holiday',
    frequency: 'Annual',
  },
  {
    id: 'event-8',
    name: 'Wine Harvest Festival',
    date: 'March - April',
    description: 'Celebration of the grape harvest season featuring wine tastings, vineyard tours, and local gastronomy.',
    location: 'Carmelo and wine regions',
    type: 'Food & Wine',
    frequency: 'Annual',
  },
])

const createFavorite = (event: Event): Favorite => ({
  id: event.id,
  type: 'event',
  title: event.name,
  description: event.location,
  savedAt: Date.now(),
})
</script>

<style scoped>
.events-page {
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

.events-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.event-card {
  display: contents;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.event-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.event-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.event-date {
  font-size: 0.9rem;
  color: var(--color-text-muted);
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

.event-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.event-description {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--color-foreground);
}

.event-meta {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.meta-row {
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.meta-row strong {
  color: var(--color-foreground);
  display: block;
  margin-bottom: 0.25rem;
}

.badge {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.85rem;
  font-weight: 500;
}

.badge--primary {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
  }

  .events-list {
    grid-template-columns: 1fr;
  }
}
</style>
