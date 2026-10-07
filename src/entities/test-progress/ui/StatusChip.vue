<script setup lang="ts">
import type { ProgressStatus } from '../model/types'
import { statusMeta } from '../lib/status'

defineProps<{ status: ProgressStatus }>()
</script>

<template>
  <span
    class="inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold"
    :class="statusMeta[status].chip"
  >
    {{ statusMeta[status].label }}
  </span>
</template>
