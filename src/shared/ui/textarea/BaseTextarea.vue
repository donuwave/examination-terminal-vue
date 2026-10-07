<script setup lang="ts">
defineProps<{
  label: string
  placeholder?: string
  rows?: number
  error?: string
  hint?: string
}>()

const model = defineModel<string>({ default: '' })
</script>

<template>
  <label class="block">
    <span class="mb-2 flex items-baseline justify-between text-sm font-semibold">
      {{ label }}
      <span v-if="hint" class="font-normal text-ink-soft">{{ hint }}</span>
    </span>
    <textarea
      v-model="model"
      :rows="rows ?? 4"
      :placeholder="placeholder"
      class="w-full resize-y rounded-2xl border bg-white px-4 py-3.5 text-[15px] leading-relaxed outline-none transition duration-200 placeholder:text-ink-soft/60 focus:ring-4"
      :class="
        error
          ? 'border-red-500 bg-red-50/50 ring-4 ring-red-100 focus:border-red-500 focus:ring-red-100'
          : 'border-line hover:border-ink/20 focus:border-brand focus:ring-brand-soft'
      "
    />
    <div class="mt-1.5 min-h-5">
      <p v-if="error?.trim()" class="text-sm leading-5 text-red-600">{{ error }}</p>
    </div>
  </label>
</template>
