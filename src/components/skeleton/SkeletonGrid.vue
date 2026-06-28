<script setup lang="ts">
import SkeletonCard from './SkeletonCard.vue'

withDefaults(
  defineProps<{
    items?: number
    columns?: string
    withImage?: boolean
    withActions?: boolean
    cardLines?: number
  }>(),
  {
    items: 6,
    columns: 'repeat(auto-fit, minmax(240px, 1fr))',
    withImage: false,
    withActions: false,
    cardLines: 3,
  },
)
</script>

<template>
  <div class="skeleton-grid" :style="{ gridTemplateColumns: columns }" aria-hidden="true">
    <SkeletonCard
      v-for="item in items"
      :key="item"
      :with-image="withImage"
      :with-actions="withActions"
      :lines="cardLines"
    />
  </div>
</template>

<style scoped>
.skeleton-grid {
  display: grid;
  gap: 1rem;
}

@media (max-width: 640px) {
  .skeleton-grid {
    grid-template-columns: 1fr !important;
  }
}
</style>
