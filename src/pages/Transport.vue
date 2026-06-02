<template>
  <div class="transport-page">
    <div class="container--main">
      <h1 class="page-title">Bus Transport Schedules</h1>
      <p class="page-subtitle">Find real bus schedules across Uruguay</p>

      <div class="filters-section">
        <div class="filters-grid">
          <input
            type="text"
            class="input--text"
            placeholder="From (origin)"
            v-model="transportStore.filteredOrigin"
            @input="transportStore.setOriginFilter(transportStore.filteredOrigin)"
          />
          <input
            type="text"
            class="input--text"
            placeholder="To (destination)"
            v-model="transportStore.filteredDestination"
            @input="transportStore.setDestinationFilter(transportStore.filteredDestination)"
          />
          <button class="btn--primary" @click="loadSchedules">Load Schedules</button>
        </div>
      </div>

      <div v-if="transportStore.error" class="error-message">
        <ErrorAlert
          title="Error Loading Schedules"
          :message="transportStore.error"
          @dismiss="transportStore.error = null"
        />
      </div>

      <div v-if="transportStore.loading" class="loading-container">
        <LoadingSpinner message="Loading bus schedules..." />
      </div>

      <div v-else-if="schedules.length === 0" class="empty-state">
        <p>No schedules found. Try adjusting your filters or load more schedules.</p>
      </div>

      <div v-else class="schedules-list">
        <div v-for="schedule in schedules" :key="schedule.id" class="schedule-card">
          <Card>
            <template #header>
              <div class="schedule-header">
                <div class="route">
                  <strong>{{ schedule.origin }}</strong> → <strong>{{ schedule.destination }}</strong>
                </div>
                <button
                  class="fav-btn"
                  :class="{ 'fav-btn--active': isFavorited(schedule.id) }"
                  @click="toggleFavorite(schedule)"
                  :title="isFavorited(schedule.id) ? 'Remove from favorites' : 'Add to favorites'"
                >
                  {{ isFavorited(schedule.id) ? '⭐' : '☆' }}
                </button>
              </div>
            </template>

            <div class="schedule-details">
              <div class="detail-row">
                <span class="label">Company:</span>
                <span class="value">{{ schedule.company }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Departure:</span>
                <span class="value">{{ schedule.departure }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Arrival:</span>
                <span class="value">{{ schedule.arrival }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Duration:</span>
                <span class="value">{{ schedule.duration }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Price:</span>
                <span class="value badge--primary">$ {{ schedule.price }}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useTransportStore } from '@/stores/transport'
import { useFavoriteToggle } from '@/composables/useFavoriteToggle'
import Card from '@/components/Card.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
import type { BusSchedule } from '@/stores/transport'
import type { Favorite } from '@/stores/favorites'

const transportStore = useTransportStore()
const { toggleFavorite, isFavorited } = useFavoriteToggle()

const schedules = computed(() => transportStore.getSchedules())

const loadSchedules = async () => {
  await transportStore.fetchSchedules()
}

onMounted(() => {
  if (transportStore.schedules.length === 0) {
    loadSchedules()
  }
})

const createFavorite = (schedule: BusSchedule): Favorite => ({
  id: schedule.id,
  type: 'transport',
  title: `${schedule.origin} → ${schedule.destination}`,
  description: `${schedule.company} | ${schedule.departure} - ${schedule.arrival}`,
  savedAt: Date.now(),
})
</script>

<style scoped>
.transport-page {
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

.filters-section {
  background-color: var(--color-secondary-light);
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  margin-bottom: 2rem;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.filters-grid input {
  width: 100%;
}

.filters-grid .btn--primary {
  width: 100%;
}

.error-message {
  margin-bottom: 2rem;
}

.loading-container {
  padding: 2rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--color-text-muted);
}

.schedules-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.schedule-card {
  display: contents;
}

.schedule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.route {
  flex: 1;
  font-size: 1.05rem;
  font-weight: 600;
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

.schedule-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-border);
}

.label {
  font-weight: 600;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.value {
  text-align: right;
}

.badge--primary {
  display: inline-block;
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-weight: 600;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
  }

  .filters-grid {
    grid-template-columns: 1fr;
  }

  .schedules-list {
    grid-template-columns: 1fr;
  }
}
</style>
