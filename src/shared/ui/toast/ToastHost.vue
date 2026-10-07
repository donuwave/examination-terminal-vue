<script setup lang="ts">
import { Icon } from '@/shared/ui/icon'
import { dismissToast, toasts } from './model'
</script>

<template>
  <TransitionGroup
    name="toast"
    tag="div"
    class="pointer-events-none fixed bottom-6 left-6 z-50 flex w-[calc(100vw-3rem)] max-w-sm flex-col gap-3"
    role="region"
    aria-live="assertive"
  >
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="pointer-events-auto relative flex items-start gap-3 overflow-hidden rounded-2xl border border-red-200 bg-red-50 py-3.5 pl-4 pr-3 shadow-[0_12px_32px_-8px_rgba(220,38,38,.28)]"
      role="alert"
    >
      <span
        class="mt-px grid h-8 w-8 shrink-0 place-items-center rounded-full bg-red-500 text-white"
      >
        <Icon name="alert-circle" size="18" />
      </span>
      <p class="flex-1 py-1 text-sm font-semibold leading-snug text-red-900">{{ toast.message }}</p>
      <button
        type="button"
        class="rounded-lg p-1.5 text-red-400 transition hover:bg-red-100 hover:text-red-700"
        aria-label="Закрыть"
        @click="dismissToast(toast.id)"
      >
        <Icon name="x" size="16" />
      </button>
      <span class="toast-timer absolute inset-x-0 bottom-0 h-0.5 origin-left bg-red-500" />
    </div>
  </TransitionGroup>
</template>
