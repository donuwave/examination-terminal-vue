<script setup lang="ts">
import 'overlayscrollbars/styles/overlayscrollbars.css'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'

/** Область с кастомным скроллбаром. Размер задаёт родитель: высота/ширина через class. */
</script>

<template>
  <OverlayScrollbarsComponent
    class="scroll-area"
    :options="{
      scrollbars: { theme: 'os-theme-soft', autoHide: 'leave', autoHideDelay: 400 },
    }"
    defer
  >
    <slot />
  </OverlayScrollbarsComponent>
</template>

<style>
.os-theme-soft {
  --os-size: 10px;
  --os-padding-perpendicular: 2px;
  --os-padding-axis: 4px;
  --os-track-border-radius: 999px;
  --os-handle-border-radius: 999px;
  --os-handle-bg: rgb(31 36 48 / 0.18);
  --os-handle-bg-hover: rgb(31 36 48 / 0.32);
  --os-handle-bg-active: rgb(47 107 255 / 0.6);
}
</style>
