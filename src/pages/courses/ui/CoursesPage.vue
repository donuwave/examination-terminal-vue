<script setup lang="ts">
import { CourseCatalog } from '@/widgets/course-catalog'
</script>

<template>
  <div class="lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
    <header class="reveal shrink-0">
      <h1 class="text-3xl font-extrabold tracking-tight">Курсы</h1>
      <p class="mt-1 text-ink-soft">Все ваши курсы в одном месте</p>
    </header>

    <div class="reveal mt-8 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col" style="--d: 80ms">
      <CourseCatalog />
    </div>
  </div>
</template>
