<template>
  <div class="climate-page">
    <div class="container--main">
      <h1 class="page-title">Climate of Uruguay</h1>
      <p class="page-subtitle">Understand Uruguay's temperate climate patterns</p>

      <div class="climate-overview">
        <Card title="General Climate Information">
          <div class="overview-content">
            <p>
              Uruguay has a temperate oceanic climate with mild winters and warm summers.
              Being located in the southern hemisphere at around 34-35°S latitude, the country experiences relatively uniform
              temperature distribution throughout the year.
            </p>
            <div class="key-facts">
              <div class="fact-box">
                <h4>Annual Temperature</h4>
                <p>16-17°C average</p>
              </div>
              <div class="fact-box">
                <h4>Summer (Dec-Feb)</h4>
                <p>20-25°C</p>
              </div>
              <div class="fact-box">
                <h4>Winter (Jun-Aug)</h4>
                <p>8-12°C</p>
              </div>
              <div class="fact-box">
                <h4>Annual Rainfall</h4>
                <p>1,200-1,400 mm</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div class="seasons-section">
        <h2 class="section-title">Seasons in Uruguay</h2>
        <div class="seasons-grid">
          <div v-for="season in seasons" :key="season.name" class="season-card">
            <Card :title="season.name">
              <template #header>
                <div class="season-header">
                  <span class="season-icon">{{ season.icon }}</span>
                </div>
              </template>

              <div class="season-content">
                <div class="season-detail">
                  <strong>Months:</strong> {{ season.months }}
                </div>
                <div class="season-detail">
                  <strong>Temperature:</strong> {{ season.temperature }}
                </div>
                <div class="season-detail">
                  <strong>Characteristics:</strong> {{ season.characteristics }}
                </div>
                <div class="season-detail">
                  <strong>Activities:</strong> {{ season.activities }}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div class="weather-factors">
        <h2 class="section-title">Weather Factors</h2>
        <div class="factors-grid">
          <Card title="Atlantic Influence">
            <p>The Atlantic Ocean significantly influences Uruguay's climate, moderating temperatures and bringing moisture that supports consistent rainfall throughout the year.</p>
          </Card>
          <Card title="Wind Patterns">
            <p>Strong winds from the Atlantic and occasional cold fronts from the south (pampero winds) are characteristic features of Uruguayan weather.</p>
          </Card>
          <Card title="Rainfall Distribution">
            <p>Rainfall is fairly evenly distributed throughout the year, with slightly higher precipitation in autumn and spring months.</p>
          </Card>
          <Card title="Humidity">
            <p>Coastal regions experience higher humidity levels due to oceanic influence, while interior areas are relatively drier.</p>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Card from '@/components/Card.vue'

interface Season {
  name: string
  icon: string
  months: string
  temperature: string
  characteristics: string
  activities: string
}

const seasons = ref<Season[]>([
  {
    name: 'Summer',
    icon: '☀️',
    months: 'December - February',
    temperature: '20-25°C (68-77°F)',
    characteristics: 'Hot, sunny days with occasional thunderstorms. Peak tourist season with beach activities.',
    activities: 'Beach activities, water sports, outdoor dining, festivals',
  },
  {
    name: 'Autumn',
    icon: '🍂',
    months: 'March - May',
    temperature: '15-20°C (59-68°F)',
    characteristics: 'Mild temperatures, higher rainfall. Beautiful foliage in some regions.',
    activities: 'Wine tasting, cultural events, nature walks',
  },
  {
    name: 'Winter',
    icon: '❄️',
    months: 'June - August',
    temperature: '8-12°C (46-54°F)',
    characteristics: 'Cold, gray days. Rainfall common. Rarely freezes or snows.',
    activities: 'Thermal spas, cultural activities, dining, wine tourism',
  },
  {
    name: 'Spring',
    icon: '🌸',
    months: 'September - November',
    temperature: '12-18°C (54-64°F)',
    characteristics: 'Mild temperatures, variable weather. Nature blooms.',
    activities: 'Hiking, birdwatching, outdoor exploration, gardening',
  },
])
</script>

<style scoped>
.climate-page {
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

.climate-overview {
  margin-bottom: 3rem;
}

.overview-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.overview-content p {
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--color-foreground);
}

.key-facts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.fact-box {
  background-color: var(--color-primary-light);
  padding: 1.5rem;
  border-radius: var(--radius-md);
  text-align: center;
}

.fact-box h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-primary);
}

.fact-box p {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-foreground);
}

.section-title {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
}

.seasons-section {
  margin-bottom: 3rem;
}

.seasons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.season-card {
  display: contents;
}

.season-header {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.season-icon {
  font-size: 2.5rem;
}

.season-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.season-detail {
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--color-foreground);
}

.season-detail strong {
  color: var(--color-primary);
}

.weather-factors {
  margin-bottom: 2rem;
}

.factors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.factors-grid :deep(.card) {
  display: flex;
  flex-direction: column;
}

.factors-grid :deep(.card__body) {
  flex: 1;
}

.factors-grid p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--color-foreground);
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
  }

  .section-title {
    font-size: 1.25rem;
  }

  .seasons-grid {
    grid-template-columns: 1fr;
  }

  .factors-grid {
    grid-template-columns: 1fr;
  }
}
</style>
