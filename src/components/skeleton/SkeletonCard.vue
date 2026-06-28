<script setup lang="ts">
import SkeletonBase from './SkeletonBase.vue'
import SkeletonText from './SkeletonText.vue'

withDefaults(
  defineProps<{
    withImage?: boolean
    withActions?: boolean
    lines?: number
    compact?: boolean
    withAvatar?: boolean
  }>(),
  {
    withImage: false,
    withActions: false,
    lines: 3,
    compact: false,
    withAvatar: false,
  },
)
</script>

<template>
  <article class="skeleton-card" :class="{ 'skeleton-card--compact': compact }" aria-hidden="true">
    <SkeletonBase
      v-if="withImage"
      class="skeleton-card__image"
      height="12rem"
      radius="0"
      variant="image"
    />

    <div class="skeleton-card__body">
      <div class="skeleton-card__header">
        <SkeletonBase
          v-if="withAvatar"
          width="2.6rem"
          height="2.6rem"
          variant="circle"
        />
        <div class="skeleton-card__title-group">
          <SkeletonBase width="64%" height="1.1rem" radius="999px" />
          <SkeletonBase width="38%" height="0.75rem" radius="999px" />
        </div>
      </div>

      <SkeletonText :lines="lines" :line-height="compact ? '0.7rem' : '0.85rem'" />

      <div class="skeleton-card__chips">
        <SkeletonBase width="4.5rem" height="1.45rem" radius="999px" />
        <SkeletonBase width="6rem" height="1.45rem" radius="999px" />
      </div>

      <div v-if="withActions" class="skeleton-card__actions">
        <SkeletonBase width="6rem" height="2.3rem" radius="0.5rem" variant="button" />
        <SkeletonBase width="2.3rem" height="2.3rem" radius="999px" variant="circle" />
      </div>
    </div>
  </article>
</template>

<style scoped>
.skeleton-card {
  overflow: hidden;
  min-width: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-background);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.06);
}

.skeleton-card--compact {
  box-shadow: none;
}

.skeleton-card__body {
  display: grid;
  gap: 1rem;
  padding: 1.1rem;
}

.skeleton-card__header {
  display: flex;
  gap: 0.8rem;
  align-items: center;
}

.skeleton-card__title-group {
  display: grid;
  width: 100%;
  gap: 0.55rem;
}

.skeleton-card__chips,
.skeleton-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  align-items: center;
}

.skeleton-card__actions {
  justify-content: space-between;
}
</style>
