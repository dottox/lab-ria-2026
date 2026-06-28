<script setup lang="ts">
import SkeletonBase from './SkeletonBase.vue'

withDefaults(
  defineProps<{
    bars?: number
  }>(),
  {
    bars: 6,
  },
)
</script>

<template>
  <div class="skeleton-chart" aria-hidden="true">
    <div class="skeleton-chart__header">
      <SkeletonBase width="42%" height="1rem" radius="999px" />
      <SkeletonBase width="6rem" height="1.6rem" radius="999px" />
    </div>
    <div class="skeleton-chart__plot">
      <SkeletonBase
        v-for="bar in bars"
        :key="bar"
        :width="`${Math.max(28, 92 - bar * 9)}%`"
        height="0.85rem"
        radius="999px"
      />
    </div>
  </div>
</template>

<style scoped>
.skeleton-chart {
  display: grid;
  gap: 1.2rem;
  padding: 1.1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-background);
}

.skeleton-chart__header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.skeleton-chart__plot {
  display: grid;
  gap: 0.85rem;
}
</style>
