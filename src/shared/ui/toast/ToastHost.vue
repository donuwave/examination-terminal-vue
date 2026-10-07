<script setup lang="ts">
import { Icon } from '@/shared/ui/icon'
import { dismissToast, toasts, type ToastKind } from './model'

const styles: Record<
  ToastKind,
  {
    card: string
    badge: string
    text: string
    close: string
    timer: string
    icon: 'alert-circle' | 'check'
  }
> = {
  error: {
    card: 'border-red-200 bg-red-50 shadow-[0_12px_32px_-8px_rgba(220,38,38,.28)]',
    badge: 'bg-red-500 text-white',
    text: 'text-red-900',
    close: 'text-red-400 hover:bg-red-100 hover:text-red-700',
    timer: 'bg-red-500',
    icon: 'alert-circle',
  },
  success: {
    card: 'border-emerald-200 bg-emerald-50 shadow-[0_12px_32px_-8px_rgba(5,150,105,.25)]',
    badge: 'bg-emerald-500 text-white',
    text: 'text-emerald-900',
    close: 'text-emerald-500 hover:bg-emerald-100 hover:text-emerald-700',
    timer: 'bg-emerald-500',
    icon: 'check',
  },
}
</script>

<template>
  <TransitionGroup
    name="toast"
    tag="div"
    class="pointer-events-none fixed bottom-6 left-6 z-50 flex w-[calc(100vw-3rem)] max-w-sm flex-col gap-3"
    role="region"
    aria-live="polite"
  >
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="pointer-events-auto relative flex items-start gap-3 overflow-hidden rounded-2xl border py-3.5 pl-4 pr-3"
      :class="styles[toast.kind].card"
      :role="toast.kind === 'error' ? 'alert' : 'status'"
    >
      <span
        class="mt-px grid h-8 w-8 shrink-0 place-items-center rounded-full"
        :class="styles[toast.kind].badge"
      >
        <Icon :name="styles[toast.kind].icon" size="18" />
      </span>
      <p class="flex-1 py-1 text-sm font-semibold leading-snug" :class="styles[toast.kind].text">
        {{ toast.message }}
      </p>
      <button
        type="button"
        class="rounded-lg p-1.5 transition"
        :class="styles[toast.kind].close"
        aria-label="Закрыть"
        @click="dismissToast(toast.id)"
      >
        <Icon name="x" size="16" />
      </button>
      <span
        class="toast-timer absolute inset-x-0 bottom-0 h-0.5 origin-left"
        :class="styles[toast.kind].timer"
      />
    </div>
  </TransitionGroup>
</template>
