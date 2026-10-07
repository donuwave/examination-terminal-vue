<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

export type ButtonVariant = 'primary' | 'secondary'

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant
    type?: 'button' | 'submit'
    /** Если задан, кнопка рисуется ссылкой роутера. */
    to?: string
    loading?: boolean
    disabled?: boolean
  }>(),
  { variant: 'primary', type: 'button' },
)

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-brand text-white shadow-[0_6px_16px_-6px_rgba(47,107,255,.6)] hover:shadow-[0_10px_20px_-6px_rgba(47,107,255,.6)]',
  secondary: 'bg-neutral-200 text-ink hover:bg-neutral-300 hover:shadow-card',
}

const classes = computed(() => [
  'inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-[15px] font-semibold transition duration-200',
  'hover:-translate-y-0.5 active:translate-y-0 active:scale-[.98]',
  'disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none',
  variants[props.variant],
])
</script>

<template>
  <RouterLink v-if="to" :to="to" :class="classes">
    <slot />
  </RouterLink>
  <button v-else :type="type" :class="classes" :disabled="disabled || loading">
    <span
      v-if="loading"
      class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
    />
    <slot />
  </button>
</template>
