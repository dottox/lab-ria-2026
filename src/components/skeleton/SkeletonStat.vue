<script setup lang="ts">
import SkeletonBase from './SkeletonBase.vue'

withDefaults(
  defineProps<{
    compact?: boolean
  }>(),
  {
    compact: false,
  },
)
</script>

<template>
  <div class="skeleton-stat" :class="{ 'skeleton-stat--compact': compact }">
    <SkeletonBase width="42%" :height="compact ? '0.75rem' : '0.85rem'" radius="999px" />
    <SkeletonBase width="72%" :height="compact ? '1.4rem' : '2rem'" radius="0.5rem" />
    <SkeletonBase width="56%" height="0.75rem" radius="999px" />
  </div>
</template>

<style scoped>
.skeleton-stat {
  display: grid;
  gap: 0.7rem;
  min-height: 6rem;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-background);
}

.skeleton-stat--compact {
  min-height: 4.75rem;
  padding: 0.85rem;
}
</style>
