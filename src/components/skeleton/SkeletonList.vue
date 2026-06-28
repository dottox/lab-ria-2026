<script setup lang="ts">
import SkeletonBase from './SkeletonBase.vue'

withDefaults(
  defineProps<{
    items?: number
    withAvatar?: boolean
    withAction?: boolean
  }>(),
  {
    items: 4,
    withAvatar: false,
    withAction: false,
  },
)
</script>

<template>
  <div class="skeleton-list" aria-hidden="true">
    <div v-for="item in items" :key="item" class="skeleton-list__item">
      <SkeletonBase v-if="withAvatar" width="2.5rem" height="2.5rem" variant="circle" />
      <div class="skeleton-list__content">
        <SkeletonBase width="62%" height="0.95rem" radius="999px" />
        <SkeletonBase width="88%" height="0.75rem" radius="999px" />
      </div>
      <SkeletonBase v-if="withAction" width="2rem" height="2rem" radius="999px" />
    </div>
  </div>
</template>

<style scoped>
.skeleton-list {
  display: grid;
  gap: 0.8rem;
}

.skeleton-list__item {
  display: flex;
  gap: 0.85rem;
  align-items: center;
  padding: 0.9rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-background);
}

.skeleton-list__content {
  display: grid;
  flex: 1;
  gap: 0.55rem;
}
</style>
