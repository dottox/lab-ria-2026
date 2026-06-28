<script setup lang="ts">
import SkeletonBase from './SkeletonBase.vue'

withDefaults(
  defineProps<{
    lines?: number
    lineHeight?: string
    gap?: string
    lastLineWidth?: string
  }>(),
  {
    lines: 3,
    lineHeight: '0.9rem',
    gap: '0.7rem',
    lastLineWidth: '70%',
  },
)
</script>

<template>
  <div class="skeleton-text" :style="{ gap }">
    <SkeletonBase
      v-for="line in lines"
      :key="line"
      :height="lineHeight"
      :width="line === lines ? lastLineWidth : '100%'"
      radius="999px"
    />
  </div>
</template>

<style scoped>
.skeleton-text {
  display: flex;
  width: 100%;
  flex-direction: column;
}
</style>
