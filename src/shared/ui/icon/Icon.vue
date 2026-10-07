<script setup lang="ts">
import type { IconName } from './icon-names'

withDefaults(defineProps<{ name: IconName; size?: number | string }>(), { size: '1em' })
</script>

<template>
  <svg class="shrink-0" :width="size" :height="size" aria-hidden="true" focusable="false">
    <use :href="`#icon-${name}`" />
  </svg>
</template>
