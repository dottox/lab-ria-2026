<template>
  <div class="tourism-page">
    <div class="container--main">
      <h1 class="page-title">Tourism in Uruguay</h1>
      <p class="page-subtitle">Explore popular destinations and attractions</p>

      <!-- Horizontal on desktop, stacked layout on mobile -->
      <div class="destinations-list">
        <div 
          v-for="destination in destinations" 
          :key="destination.id" 
          class="destination-card-wrapper"
        >
          <!-- Custom Interactive Card structure based on image_7829e4.png -->
          <div 
            class="interactive-card" 
            :style="{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.4)), url(${destination.image})` }"
          >
            <!-- Favorite button floating over the image wrapper -->
            <button
              class="fav-btn"
              :class="{ 'fav-btn--active': isFavorited(destination.id) }"
              @click.stop="toggleFavorite(destination)"
            >
              {{ isFavorited(destination.id) ? '⭐' : '☆' }}
            </button>

            <!-- Initial state: Centered 3-letter abbreviation -->
            <div class="card-abbreviation">
              {{ destination.code }}
            </div>

            <!-- Hover State Content: Slides/Reveals up from the bottom -->
            <div class="card-hover-content">
              <div class="hover-main-info">
                <div class="hover-left">
                  <h3 class="destination-name">{{ destination.name }}</h3>
                  <p class="destination-region">{{ destination.region }}</p>
                </div>
                <div class="hover-right">
                  <p class="destination-desc">{{ destination.description }}</p>
                </div>
              </div>
              
              <!-- Extended meta info footer inside the hover window -->
              <div class="hover-footer-info">
                <div class="highlights">
                  <span v-for="highlight in destination.highlights" :key="highlight" class="badge">
                    {{ highlight }}
                  </span>
                </div>
                <div class="meta-metrics">
                  <span><strong>Best:</strong> {{ destination.bestTime }}</span>
                  <span><strong>Dist:</strong> {{ destination.distance }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useFavoriteToggle } from '@/composables/useFavoriteToggle'
import type { Favorite } from '@/stores/favorites'

interface Destination {
  id: string
  name: string
  region: string
  code: string // 3-letter abbreviation required by image_7829e4.png
  image: string // Dynamic background image
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
    code: 'PDE',
    image: 'https://images.unsplash.com/photo-1590055486950-84c4f93822f3?q=80&w=800&auto=format&fit=crop',
    icon: '🏖️',
    description: 'A world-famous beach resort known for its luxury amenities, nightlife, and stunning coastal scenery.',
    highlights: ['Casapueblo', 'Marina', 'Shopping'],
    bestTime: 'Dec - Feb',
    distance: '139 km',
  },
  {
    id: 'dest-2',
    name: 'Colonia del Sacramento',
    region: 'Colonia Department',
    code: 'COL',
    image: 'https://images.unsplash.com/photo-1569335728635-430c64117b96?q=80&w=800&auto=format&fit=crop',
    icon: '🏛️',
    description: 'A UNESCO World Heritage site with charming historic colonial architecture and cobblestone streets.',
    highlights: ['Historic Town', 'River Views', 'Museums'],
    bestTime: 'Mar - May',
    distance: '177 km',
  },
  {
    id: 'dest-3',
    name: 'Montevideo',
    region: 'Capital',
    code: 'MVD',
    image: 'https://images.unsplash.com/photo-1594914104207-6b2a09f87c12?q=80&w=800&auto=format&fit=crop',
    icon: '🏙️',
    description: 'Uruguay\'s vibrant capital city offering cultural activities and the iconic Rambla waterfront promenade.',
    highlights: ['Rambla', 'Theater', 'Markets'],
    bestTime: 'Year-round',
    distance: '0 km',
  },
  {
    id: 'dest-4',
    name: 'Rocha Department',
    region: 'Eastern Coast',
    code: 'RCH',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    icon: '🌊',
    description: 'A pristine coastal region with beautiful wild beaches, lagoons, and protected natural reserves.',
    highlights: ['Beaches', 'Wildlife', 'Lagoons'],
    bestTime: 'Sep - Nov',
    distance: '250 km',
  },
  {
    id: 'dest-5',
    name: 'Salto',
    region: 'Northern Uruguay',
    code: 'STO',
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=800&auto=format&fit=crop',
    icon: '💧',
    description: 'Known for its famous thermal spas and hot springs. A relaxing destination perfect for wellness.',
    highlights: ['Thermal Spas', 'Hot Springs', 'Nature'],
    bestTime: 'Jun - Aug',
    distance: '496 km',
  },
  {
    id: 'dest-6',
    name: 'Carmelo',
    region: 'West Coast',
    code: 'CRM',
    image: 'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?q=80&w=800&auto=format&fit=crop',
    icon: '🍷',
    description: 'A charming small town famous for boutique wine production and rolling countryside views.',
    highlights: ['Wineries', 'Restaurants', 'River'],
    bestTime: 'Apr - Nov',
    distance: '210 km',
  },
])

// Keep this around for sync checks or your store mapping logic
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

/* Master list container mapping to the horizontal widescreen requirement */
.destinations-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Structural Container setup */
.destination-card-wrapper {
  width: 100%;
}

/* Main interactive block mimicking image_7829e4.png specifications */
.interactive-card {
  position: relative;
  width: 100%;
  height: 260px; /* Perfect aspect ratio for horizontal styling */
  background-size: cover;
  background-position: center;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.interactive-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px -3px rgba(0, 0, 0, 0.15);
}

/* Initial State: Big 3-Letter center code */
.card-abbreviation {
  font-size: 3.5rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 4px;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
  opacity: 1;
  transform: scale(1);
  transition: opacity var(--transition-base), transform var(--transition-base);
}

/* Fade away the initials on card hover */
.interactive-card:hover .card-abbreviation {
  opacity: 0;
  transform: scale(0.9);
}

/* Hover Window Slide/Reveal Animation Panel */
.card-hover-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--color-background);
  border-top: 1px solid var(--color-border);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  /* Slide transform states */
  transform: translateY(101%);
  transition: transform var(--transition-slow);
}

/* Triggers the slide-up movement */
.interactive-card:hover .card-hover-content {
  transform: translateY(0);
}

/* Split content structure */
.hover-main-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

/* Name (Left Aligned) */
.hover-left {
  flex: 1;
  min-width: 0;
}

.destination-name {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--color-foreground);
}

.destination-region {
  margin: 0.25rem 0 0 0;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  font-weight: 500;
}

/* Description (Right Aligned per diagram blueprint) */
.hover-right {
  flex: 1.5;
  text-align: right;
}

.destination-desc {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--color-foreground);
}

/* Meta Footer Section */
.hover-footer-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-border-light);
}

.highlights {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.badge {
  padding: 0.25rem 0.6rem;
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
}

.meta-metrics {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

/* Floating Utility Items */
.fav-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  cursor: pointer;
  transition: transform var(--transition-fast), background-color var(--transition-fast);
}

.fav-btn:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.4);
}

.fav-btn--active {
  background: white !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

/* Responsive Overrides (Vertical viewports on phones) */
@media (max-width: 768px) {
  .page-title {
    font-size: 1.6rem;
  }

  .destinations-list {
    gap: 1.5rem;
  }

  .interactive-card {
    height: auto;
    min-height: 360px;
    flex-direction: column;
    justify-content: flex-start;
    padding-top: 3.5rem;
  }

  /* Keep initials legible at top background tier on small screens */
  .card-abbreviation {
    font-size: 2.5rem;
    margin-bottom: auto;
  }

  /* Force continuous vertical static blocks on mobile instead of tricky overlays */
  .card-hover-content {
    position: relative;
    transform: translateY(0);
    width: 100%;
    border-top: 1px solid var(--color-border);
    padding: 1rem;
  }

  .hover-main-info {
    flex-direction: column;
    gap: 0.75rem;
  }

  .hover-right {
    text-align: left; /* Shift text to left on narrow screens for native fluid scanning */
  }

  .hover-footer-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .meta-metrics {
    width: 100%;
    justify-content: space-between;
  }
}
</style>