<template>
  <button :class="buttonClass" @click="$emit('click')" :disabled="disabled">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  disabled: false,
})

defineEmits<{
  click: []
}>()

const buttonClass = computed(() => {
  const base = 'px-4 py-2 rounded-[var(--radius-md)] font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
  const variant = props.variant === 'primary'
    ? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]'
    : 'bg-[var(--color-secondary-light)] text-[var(--color-secondary)] hover:bg-[var(--color-border)]'
  return `${base} ${variant}`
})
</script>
