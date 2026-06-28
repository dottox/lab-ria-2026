<script setup lang="ts">
type SkeletonVariant = 'text' | 'circle' | 'card' | 'image' | 'button'

withDefaults(
  defineProps<{
    width?: string
    height?: string
    radius?: string
    variant?: SkeletonVariant
  }>(),
  {
    width: '100%',
    height: '1rem',
    radius: '0.75rem',
    variant: 'text',
  },
)
</script>

<template>
  <div
    class="skeleton-base"
    :class="`skeleton-base--${variant}`"
    :style="{
      width,
      height,
      borderRadius: variant === 'circle' ? '999px' : radius,
    }"
    aria-hidden="true"
  />
</template>

<style scoped>
.skeleton-base {
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--skeleton-base, rgba(148, 163, 184, 0.18));
}

.skeleton-base::after {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent,
    var(--skeleton-highlight, rgba(255, 255, 255, 0.42)),
    transparent
  );
  content: '';
  transform: translateX(-100%);
  animation: skeleton-shimmer 1.35s infinite;
}

.skeleton-base--card,
.skeleton-base--image {
  min-height: 1rem;
}

.skeleton-base--button {
  min-width: 5rem;
}

@keyframes skeleton-shimmer {
  100% {
    transform: translateX(100%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-base::after {
    animation: none;
  }
}
</style>
