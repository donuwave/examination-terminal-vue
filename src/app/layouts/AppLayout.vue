<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { AppSidebar } from '@/widgets/app-sidebar'

const route = useRoute()

/**
 * Страница с «фиксированной» шапкой (meta.fixed): на широких экранах весь экран занят,
 * сама страница не прокручивается, а прокручиваются только её внутренние области.
 */
const fixed = computed(() => Boolean(route.meta.fixed))
</script>

<template>
  <div class="flex min-h-screen" :class="fixed && 'lg:h-screen lg:overflow-hidden'">
    <AppSidebar />
    <main
      class="min-w-0 flex-1 px-4 py-8 lg:px-10"
      :class="fixed && 'lg:flex lg:min-h-0 lg:flex-col'"
    >
      <!-- Единая ширина контента для всех страниц приложения. -->
      <div
        class="mx-auto w-full max-w-6xl"
        :class="fixed && 'lg:flex lg:min-h-0 lg:flex-1 lg:flex-col'"
      >
        <RouterView />
      </div>
    </main>
  </div>
</template>
