<script setup lang="ts">
import type { Role } from '../model/types'
import { roleStyle } from '../lib/role-style'

defineProps<{
  role: Role
  selected?: boolean
  invalid?: boolean
}>()
</script>

<template>
  <button
    type="button"
    class="rounded-2xl border-2 p-3.5 text-left transition duration-200 hover:-translate-y-0.5 active:scale-[.98]"
    :class="
      selected
        ? 'border-brand bg-brand-soft/60'
        : invalid
          ? 'border-red-500 bg-red-50/50'
          : 'border-line bg-white hover:border-ink/20'
    "
    :aria-pressed="selected"
  >
    <span class="block h-2.5 w-8 rounded-full" :class="roleStyle(role.name).bg" />
    <span class="mt-2.5 block text-sm font-bold">{{ role.name }}</span>
    <span class="mt-0.5 block text-xs text-ink-soft">{{ roleStyle(role.name).hint }}</span>
  </button>
</template>
