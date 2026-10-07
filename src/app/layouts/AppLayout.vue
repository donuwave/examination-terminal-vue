<script setup lang="ts">
import { RouterView } from 'vue-router'
import { AppSidebar } from '@/widgets/app-sidebar'
</script>

<template>
  <div class="flex min-h-screen">
    <AppSidebar />
    <main class="min-w-0 flex-1 px-4 py-8 lg:px-10">
      <!-- Единая ширина контента для всех страниц приложения. -->
      <div class="mx-auto w-full max-w-6xl">
        <RouterView />
      </div>
    </main>
  </div>
</template>
