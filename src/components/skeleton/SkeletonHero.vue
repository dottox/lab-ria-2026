<script setup lang="ts">
import SkeletonBase from './SkeletonBase.vue'
import SkeletonStat from './SkeletonStat.vue'
import SkeletonText from './SkeletonText.vue'

withDefaults(
  defineProps<{
    large?: boolean
    withStats?: boolean
    withActions?: boolean
    dark?: boolean
  }>(),
  {
    large: false,
    withStats: false,
    withActions: true,
    dark: false,
  },
)
</script>

<template>
  <section
    class="skeleton-hero"
    :class="{
      'skeleton-hero--large': large,
      'skeleton-hero--dark': dark,
    }"
    aria-hidden="true"
  >
    <div class="skeleton-hero__content">
      <SkeletonBase width="8rem" height="0.85rem" radius="999px" />
      <SkeletonBase width="min(34rem, 86%)" :height="large ? '4.4rem' : '3rem'" radius="0.7rem" />
      <SkeletonText :lines="2" line-height="0.95rem" last-line-width="58%" />

      <div v-if="withActions" class="skeleton-hero__actions">
        <SkeletonBase width="8rem" height="2.5rem" radius="0.55rem" variant="button" />
        <SkeletonBase width="9rem" height="2.5rem" radius="0.55rem" variant="button" />
      </div>
    </div>

    <div v-if="withStats" class="skeleton-hero__stats">
      <SkeletonStat v-for="item in 3" :key="item" compact />
    </div>
  </section>
</template>

<style scoped>
.skeleton-hero {
  display: grid;
  gap: 1.5rem;
  padding: 2rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-background);
}

.skeleton-hero--large {
  min-height: 28rem;
  align-content: end;
}

.skeleton-hero--dark {
  --skeleton-base: rgba(255, 255, 255, 0.16);
  --skeleton-highlight: rgba(255, 255, 255, 0.22);
  border-color: rgba(255, 255, 255, 0.14);
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(30, 41, 59, 0.78));
}

.skeleton-hero__content {
  display: grid;
  max-width: 48rem;
  gap: 1rem;
}

.skeleton-hero__actions,
.skeleton-hero__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.skeleton-hero__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

@media (max-width: 720px) {
  .skeleton-hero {
    padding: 1.25rem;
  }

  .skeleton-hero__stats {
    grid-template-columns: 1fr;
  }
}
</style>
