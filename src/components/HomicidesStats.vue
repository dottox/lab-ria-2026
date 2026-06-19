<template>
  <section class="homicides-stats" aria-labelledby="homicides-stats-title">
    <div class="homicides-stats__header">
      <div>
        <div class="homicides-stats__title-row">
          <h2 id="homicides-stats-title" class="homicides-stats__title">
            Homicidios en Uruguay
          </h2>
          <span class="homicides-stats__badge homicides-stats__badge--warning">
            Datos no oficiales
          </span>
        </div>
        <p class="homicides-stats__description">
          Simulación de consulta a servicio de datos públicos de seguridad.
        </p>
      </div>

      <button
        class="homicides-stats__refresh"
        type="button"
        :disabled="loading"
        @click="loadHomicides"
      >
        {{ loading ? "Actualizando" : "Actualizar" }}
      </button>
    </div>

    <LoadingSpinner
      v-if="loading && !hasData"
      message="Cargando indicadores de seguridad..."
    />

    <ErrorAlert
      v-if="error"
      title="No se pudo consultar el servicio"
      :message="error"
      :dismissible="false"
    />

    <template v-if="data">
      <div class="homicides-stats__meta">
        <span>Fuente: {{ data.source }}</span>
        <span>{{ data.sourceDescription }}</span>
        <span>Actualizado: {{ formatDate(data.updatedAt) }}</span>
        <span v-if="cachedAt">Cache local: {{ formatDate(cachedAt) }}</span>
        <span v-if="fromCache" class="homicides-stats__cache">Datos desde cache</span>
      </div>

      <div v-if="latestYear" class="homicides-stats__summary">
        <Card title="Último año disponible">
          <p class="summary-card__value">{{ latestYear.year }}</p>
          <p class="summary-card__label">Serie anual simulada</p>
        </Card>

        <Card title="Total del último año">
          <p class="summary-card__value">{{ latestYear.total }}</p>
          <p class="summary-card__label">Casos simulados</p>
        </Card>

        <Card title="Tasa cada 100.000 habitantes">
          <p class="summary-card__value">{{ formatRate(latestYear.ratePer100k) }}</p>
          <p class="summary-card__label">Indicador poblacional</p>
        </Card>

        <Card title="Variación anual">
          <p class="summary-card__value" :class="getVariationClass(latestYear.variation)">
            {{ formatVariation(latestYear.variation) }}
          </p>
          <p class="summary-card__label">Respecto al año anterior</p>
        </Card>
      </div>

      <div class="homicides-stats__content">
        <Card
          title="Ranking por departamento"
          description="Totales simulados del último año"
        >
          <ol class="department-ranking">
            <li
              v-for="department in rankedDepartments"
              :key="department.department"
              class="department-ranking__item"
            >
              <div>
                <span class="department-ranking__name">{{ department.department }}</span>
                <span class="department-ranking__rate">
                  {{ formatRate(department.ratePer100k) }} cada 100.000
                </span>
              </div>
              <strong>{{ department.total }}</strong>
            </li>
          </ol>
        </Card>

        <Card
          title="Evolución anual"
          description="Barras proporcionales por total simulado"
        >
          <div class="annual-bars">
            <div v-for="year in data.years" :key="year.year" class="annual-bars__item">
              <span class="annual-bars__year">{{ year.year }}</span>
              <div class="annual-bars__track" aria-hidden="true">
                <div
                  class="annual-bars__bar"
                  :style="{ width: getYearWidth(year.total) }"
                ></div>
              </div>
              <span class="annual-bars__total">{{ year.total }}</span>
            </div>
          </div>
        </Card>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Card from "@/components/Card.vue";
import ErrorAlert from "@/components/ErrorAlert.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { useHomicides } from "@/composables/useHomicides";

const {
  data,
  loading,
  error,
  cachedAt,
  fromCache,
  hasData,
  loadHomicides,
} = useHomicides();

const dateFormatter = new Intl.DateTimeFormat("es-UY", {
  dateStyle: "medium",
  timeStyle: "short",
});

const latestYear = computed(() => {
  if (!data.value?.years.length) {
    return null;
  }

  return data.value.years[data.value.years.length - 1];
});

const rankedDepartments = computed(() => {
  if (!data.value) {
    return [];
  }

  return [...data.value.departments].sort((a, b) => b.total - a.total);
});

const maxAnnualTotal = computed(() => {
  if (!data.value?.years.length) {
    return 1;
  }

  return Math.max(...data.value.years.map((year) => year.total));
});

const formatDate = (value: string) => dateFormatter.format(new Date(value));

const formatRate = (value: number) =>
  new Intl.NumberFormat("es-UY", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);

const formatVariation = (value: number) => {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
};

const getVariationClass = (value: number) => ({
  "summary-card__value--up": value > 0,
  "summary-card__value--down": value < 0,
});

const getYearWidth = (total: number) => {
  const width = Math.max((total / maxAnnualTotal.value) * 100, 8);
  return `${width}%`;
};
</script>

<style scoped>
.homicides-stats {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 3rem;
  padding: 1.5rem;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.homicides-stats__header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}

.homicides-stats__title-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.homicides-stats__title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-primary);
}

.homicides-stats__description {
  margin: 0.35rem 0 0;
  color: var(--color-text-muted);
  line-height: 1.5;
}

.homicides-stats__badge,
.homicides-stats__cache {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.25rem 0.65rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--color-tertiary);
  background: var(--color-tertiary-light);
}

.homicides-stats__badge--warning,
.homicides-stats__cache {
  color: var(--color-warning);
  background: var(--color-secondary-light);
}

.homicides-stats__refresh {
  flex: 0 0 auto;
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-md);
  padding: 0.65rem 1rem;
  color: white;
  background: var(--color-primary);
  font-weight: 700;
  cursor: pointer;
  transition: background var(--transition-base), border-color var(--transition-base),
    opacity var(--transition-base);
}

.homicides-stats__refresh:hover:not(:disabled) {
  background: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
}

.homicides-stats__refresh:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.homicides-stats__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1rem;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.homicides-stats__summary,
.homicides-stats__content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 1rem;
}

.homicides-stats__content {
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.summary-card__value {
  margin: 0.75rem 0 0.25rem;
  color: var(--color-primary);
  font-size: 2rem;
  font-weight: 800;
  line-height: 1;
}

.summary-card__label {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.summary-card__value--up {
  color: var(--color-error);
}

.summary-card__value--down {
  color: var(--color-success);
}

.department-ranking {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  margin: 1rem 0 0;
  padding: 0;
  list-style: none;
}

.department-ranking__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.75rem;
}

.department-ranking__item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.department-ranking__name,
.department-ranking__item strong {
  display: block;
  color: var(--color-foreground);
  font-weight: 700;
}

.department-ranking__rate {
  display: block;
  margin-top: 0.15rem;
  color: var(--color-text-muted);
  font-size: 0.85rem;
}

.annual-bars {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  margin-top: 1rem;
}

.annual-bars__item {
  display: grid;
  grid-template-columns: 3.5rem minmax(0, 1fr) 3rem;
  gap: 0.75rem;
  align-items: center;
}

.annual-bars__year,
.annual-bars__total {
  color: var(--color-text-muted);
  font-size: 0.9rem;
  font-weight: 700;
}

.annual-bars__total {
  color: var(--color-foreground);
  text-align: right;
}

.annual-bars__track {
  height: 0.7rem;
  overflow: hidden;
  background: var(--color-surface);
  border-radius: 999px;
}

.annual-bars__bar {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-tertiary));
  border-radius: inherit;
}

@media (max-width: 640px) {
  .homicides-stats {
    padding: 1rem;
  }

  .homicides-stats__header {
    flex-direction: column;
  }

  .homicides-stats__refresh {
    width: 100%;
  }

  .annual-bars__item {
    grid-template-columns: 3rem minmax(0, 1fr) 2.5rem;
  }
}
</style>
