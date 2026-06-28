<template>
  <section class="currency-rates" aria-labelledby="currency-rates-title">
    <div class="currency-rates__header">
      <div>
        <div class="currency-rates__title-row">
          <h2 id="currency-rates-title" class="currency-rates__title">Cotizaciones</h2>
        </div>
        <p class="currency-rates__description">Consulta a servicio externo de monedas.</p>
      </div>

      <button
        class="currency-rates__refresh"
        type="button"
        :disabled="loading"
        @click="loadCurrency"
      >
        {{ loading ? "Actualizando" : "Actualizar" }}
      </button>
    </div>

    <SkeletonGrid v-if="loading && !hasData" :items="4" :card-lines="2" />

    <ErrorAlert
      v-if="error"
      title="No se pudo consultar el servicio"
      :message="error"
      :dismissible="false"
    />

    <template v-if="data">
      <div class="currency-rates__meta">
        <span>Fuente: {{ data.source }}</span>
        <span>Actualizado: {{ formatDate(data.updatedAt) }}</span>
        <span v-if="cachedAt">Cache local: {{ formatDate(cachedAt) }}</span>
        <span v-if="fromCache" class="currency-rates__cache">Datos desde cache</span>
      </div>

      <div class="currency-rates__grid">
        <Card
          v-for="rate in data.rates"
          :key="rate.code"
          :title="rate.code"
          :description="rate.name"
        >
          <dl class="currency-card">
            <div class="currency-card__row">
              <dt>Compra</dt>
              <dd>{{ formatCurrency(rate.buy) }}</dd>
            </div>
            <div class="currency-card__row">
              <dt>Venta</dt>
              <dd>{{ formatCurrency(rate.sell) }}</dd>
            </div>
            <div class="currency-card__row">
              <dt>Variación</dt>
              <dd :class="getVariationClass(rate.variation)">
                {{ formatVariation(rate.variation) }}
              </dd>
            </div>
          </dl>
        </Card>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import Card from "@/components/Card.vue";
import ErrorAlert from "@/components/ErrorAlert.vue";
import { SkeletonGrid } from "@/components/skeleton";
import { useCurrency } from "@/composables/useCurrency";

const {
  data,
  loading,
  error,
  cachedAt,
  fromCache,
  hasData,
  loadCurrency,
} = useCurrency();

const currencyFormatter = new Intl.NumberFormat("es-UY", {
  style: "currency",
  currency: "UYU",
  minimumFractionDigits: 2,
  maximumFractionDigits: 3,
});

const dateFormatter = new Intl.DateTimeFormat("es-UY", {
  dateStyle: "medium",
  timeStyle: "short",
});

const formatCurrency = (value: number) => currencyFormatter.format(value);

const formatDate = (value: string) => dateFormatter.format(new Date(value));

const formatVariation = (value: number) => {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
};

const getVariationClass = (value: number) => ({
  "currency-card__variation--up": value > 0,
  "currency-card__variation--down": value < 0,
});
</script>

<style scoped>
.currency-rates {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 3rem;
  padding: 1.5rem;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.currency-rates__header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}

.currency-rates__title-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.currency-rates__title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-primary);
}

.currency-rates__description {
  margin: 0.35rem 0 0;
  color: var(--color-text-muted);
  line-height: 1.5;
}

.currency-rates__badge,
.currency-rates__cache {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.25rem 0.65rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--color-tertiary);
  background: var(--color-tertiary-light);
}

.currency-rates__cache {
  color: var(--color-warning);
  background: var(--color-secondary-light);
}

.currency-rates__refresh {
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

.currency-rates__refresh:hover:not(:disabled) {
  background: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
}

.currency-rates__refresh:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.currency-rates__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1rem;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.currency-rates__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 1rem;
}

.currency-card {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  margin: 1rem 0 0;
}

.currency-card__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.75rem;
}

.currency-card__row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.currency-card dt {
  color: var(--color-text-muted);
  font-size: 0.9rem;
  font-weight: 600;
}

.currency-card dd {
  margin: 0;
  color: var(--color-foreground);
  font-size: 1rem;
  font-weight: 700;
  text-align: right;
}

.currency-card__variation--up {
  color: var(--color-success) !important;
}

.currency-card__variation--down {
  color: var(--color-error) !important;
}

@media (max-width: 640px) {
  .currency-rates {
    padding: 1rem;
  }

  .currency-rates__header {
    flex-direction: column;
  }

  .currency-rates__refresh {
    width: 100%;
  }
}
</style>
