<template>
  <div class="card">
    <div class="card__header" v-if="$slots.header">
      <slot name="header"></slot>
    </div>
    <div class="card__body">
      <h3 class="card__title" v-if="title">{{ title }}</h3>
      <p class="card__description" v-if="description">{{ description }}</p>
      <slot></slot>
    </div>
    <div class="card__footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T">
defineProps<{
  title?: string
  description?: string
}>()
</script>

<style scoped>
.card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all var(--transition-base);
  overflow: hidden;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.card__header {
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-surface);
}

.card__body {
  padding: 1.5rem;
}

.card__title {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-foreground);
}

.card__description {
  margin: 0;
  font-size: 0.95rem;
  color: var(--color-text-muted);
  line-height: 1.5;
}

.card__footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--color-border);
  background-color: var(--color-surface);
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}
</style>
