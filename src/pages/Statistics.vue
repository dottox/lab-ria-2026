<template>
  <div class="statistics-page">
    <div class="container--main">
      <h1 class="page-title">Estadísticas de Uruguay</h1>
      <p class="page-subtitle">Datos y estadísticas clave sobre Uruguay</p>

      <SkeletonGrid v-if="isLoading" class="stats-grid-large" :items="4" :card-lines="2" />

      <div v-else class="stats-grid-large">
        <Card title="Población">
          <div class="stat-display">
            <div class="stat-number">3.5M</div>
            <p class="stat-description">Población total (2024)</p>
            <div class="stat-detail">
              <strong>Capital:</strong> Montevideo (1.3M)
            </div>
          </div>
        </Card>

        <Card title="Economía">
          <div class="stat-display">
            <div class="stat-number">PIB: $68B</div>
            <p class="stat-description">PIB nominal (2023)</p>
            <div class="stat-detail">
              <strong>Per cápita:</strong> $19,400
            </div>
          </div>
        </Card>

        <Card title="Área">
          <div class="stat-display">
            <div class="stat-number">176,220</div>
            <p class="stat-description">km² (68,034 sq mi)</p>
            <div class="stat-detail">
              <strong>Costa:</strong> 1,055 km
            </div>
          </div>
        </Card>

        <Card title="Idioma oficial">
          <div class="stat-display">
            <div class="stat-number">Español</div>
            <p class="stat-description">Dialecto español rioplatense</p>
            <div class="stat-detail">
              <strong>Tasa de alfabetización:</strong> 98.1%
            </div>
          </div>
        </Card>
      </div>

      <CurrencyRates />

      <HomicidesStats />

      <SkeletonGrid v-if="isLoading" :items="6" :card-lines="4" />

      <div v-else class="sections">
        <section class="stat-section">
          <h2 class="section-title">Demografía</h2>
          <div class="stat-list">
            <div class="stat-item">
              <span class="label">Esperanza de vida</span>
              <span class="value">76.5 años</span>
            </div>
            <div class="stat-item">
              <span class="label">Edad media</span>
              <span class="value">34.2 años</span>
            </div>
            <div class="stat-item">
              <span class="label">Población urbana</span>
              <span class="value">95.5%</span>
            </div>
            <div class="stat-item">
              <span class="label">Crecimiento poblacional</span>
              <span class="value">0.25% anual</span>
            </div>
          </div>
        </section>

        <section class="stat-section">
          <h2 class="section-title">Educación</h2>
          <div class="stat-list">
            <div class="stat-item">
              <span class="label">Inscripción en educación primaria</span>
              <span class="value">99.2%</span>
            </div>
            <div class="stat-item">
              <span class="label">Educación secundaria</span>
              <span class="value">94.1%</span>
            </div>
            <div class="stat-item">
              <span class="label">Educación terciaria</span>
              <span class="value">42.3%</span>
            </div>
            <div class="stat-item">
              <span class="label">Puesto en el índice global de educación</span>
              <span class="value">19.º mundial</span>
            </div>
          </div>
        </section>

        <section class="stat-section">
          <h2 class="section-title">Salud</h2>
          <div class="stat-list">
            <div class="stat-item">
              <span class="label">Gasto en salud</span>
              <span class="value">9.2% del PIB</span>
            </div>
            <div class="stat-item">
              <span class="label">Médicos cada 10,000 habitantes</span>
              <span class="value">42.8</span>
            </div>
            <div class="stat-item">
              <span class="label">Camas hospitalarias cada 10,000 habitantes</span>
              <span class="value">27.3</span>
            </div>
            <div class="stat-item">
              <span class="label">Cobertura universal de salud</span>
              <span class="value">100%</span>
            </div>
          </div>
        </section>

        <section class="stat-section">
          <h2 class="section-title">Infraestructura</h2>
          <div class="stat-list">
            <div class="stat-item">
              <span class="label">Rutas pavimentadas</span>
              <span class="value">8,950 km</span>
            </div>
            <div class="stat-item">
              <span class="label">Penetración de internet</span>
              <span class="value">88.5%</span>
            </div>
            <div class="stat-item">
              <span class="label">Usuarios de telefonía móvil</span>
              <span class="value">140% de la población</span>
            </div>
            <div class="stat-item">
              <span class="label">Aeropuerto principal</span>
              <span class="value">Carrasco Internacional (MVD)</span>
            </div>
          </div>
        </section>

        <section class="stat-section">
          <h2 class="section-title">Medio ambiente</h2>
          <div class="stat-list">
            <div class="stat-item">
              <span class="label">Uso de energía renovable</span>
              <span class="value">63% de la electricidad</span>
            </div>
            <div class="stat-item">
              <span class="label">Tasa de deforestación</span>
              <span class="value">-0.1% (reforestación)</span>
            </div>
            <div class="stat-item">
              <span class="label">Emisiones de carbono per cápita</span>
              <span class="value">1.9 toneladas de CO₂</span>
            </div>
            <div class="stat-item">
              <span class="label">Índice de desempeño ambiental</span>
              <span class="value">27.º mundial</span>
            </div>
          </div>
        </section>

        <section class="stat-section">
          <h2 class="section-title">Gobierno y política</h2>
          <div class="stat-list">
            <div class="stat-item">
              <span class="label">Tipo de gobierno</span>
              <span class="value">República presidencial</span>
            </div>
            <div class="stat-item">
              <span class="label">Fecha de independencia</span>
              <span class="value">25 de agosto de 1828</span>
            </div>
            <div class="stat-item">
              <span class="label">Índice de democracia</span>
              <span class="value">Democracia plena (9.04/10)</span>
            </div>
            <div class="stat-item">
              <span class="label">Índice de percepción de corrupción</span>
              <span class="value">23.º menos corrupto</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from '@/components/Card.vue'
import CurrencyRates from '@/components/CurrencyRates.vue'
import HomicidesStats from '@/components/HomicidesStats.vue'
import { SkeletonGrid } from '@/components/skeleton'
import { useMinimumLoading } from '@/composables/useMinimumLoading'

const { isLoading } = useMinimumLoading(420)
</script>

<style scoped>
.statistics-page {
  padding: 6.5rem 0 4rem;
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

.stats-grid-large {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-display {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-primary);
}

.stat-description {
  margin: 0;
  font-size: 0.95rem;
  color: var(--color-text-muted);
}

.stat-detail {
  font-size: 0.9rem;
  color: var(--color-foreground);
}

.stat-detail strong {
  display: block;
  font-weight: 600;
}

.sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.stat-section {
  background: var(--background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
}

.section-title {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-primary);
  border-bottom: 2px solid var(--color-primary-light);
  padding-bottom: 0.75rem;
}

.stat-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-border);
}

.stat-item:last-child {
  border-bottom: none;
}

.label {
  font-size: 0.95rem;
  color: var(--color-text-muted);
  font-weight: 500;
  flex: 1;
}

.value {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-primary);
  text-align: right;
  flex: 0 0 auto;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
  }

  .stats-grid-large {
    grid-template-columns: 1fr;
  }

  .sections {
    grid-template-columns: 1fr;
  }

  .stat-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .value {
    text-align: left;
  }
}
</style>
