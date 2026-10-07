<script setup lang="ts">
import { BaseButton } from '@/shared/ui/button'
import { BaseDialog } from '@/shared/ui/dialog'

defineProps<{
  title: string
  text: string
  confirmLabel: string
  cancelLabel?: string
  loading?: boolean
}>()

const emit = defineEmits<{ confirm: [] }>()
const open = defineModel<boolean>({ default: false })
</script>

<template>
  <BaseDialog v-model="open" :title="title">
    <h2 class="text-xl font-extrabold">{{ title }}</h2>
    <p class="mt-2 text-ink-soft">{{ text }}</p>

    <div class="mt-6 grid grid-cols-2 gap-3">
      <BaseButton variant="secondary" :disabled="loading" @click="open = false">
        {{ cancelLabel ?? 'Отмена' }}
      </BaseButton>
      <BaseButton variant="danger" :loading="loading" @click="emit('confirm')">
        {{ confirmLabel }}
      </BaseButton>
    </div>
  </BaseDialog>
</template>
