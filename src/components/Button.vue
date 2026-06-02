<template>
  <button :class="buttonClass" @click="$emit('click')" :disabled="disabled">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'tertiary'
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
  const base = 'px-4 py-2 rounded-[var(--radius-md)] font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md'
  let variant = ''
  
  switch (props.variant) {
    case 'primary':
      variant = 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]'
      break
    case 'secondary':
      variant = 'bg-[var(--color-secondary-light)] text-[var(--color-secondary)] hover:bg-[var(--color-surface-hover)] dark:bg-[var(--color-secondary-light)] dark:text-[var(--color-secondary)]'
      break
    case 'tertiary':
      variant = 'bg-[var(--color-tertiary-light)] text-[var(--color-tertiary)] hover:bg-[var(--color-tertiary)] hover:text-white'
      break
  }
  
  return `${base} ${variant}`
})
</script>

