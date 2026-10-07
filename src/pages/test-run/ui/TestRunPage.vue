<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProgress } from '@/entities/test-progress'
import { Icon } from '@/shared/ui/icon'
import { TestIntro } from '@/widgets/test-intro'
import { TestResult } from '@/widgets/test-result'
import { TestRunner } from '@/widgets/test-runner'

const route = useRoute()
const id = computed(() => Number(route.params.id))
const { data: progress, isPending, isError } = useProgress(id)
</script>

<template>
  <main class="mx-auto min-h-screen max-w-5xl px-4 py-8">
    <div v-if="isPending" class="space-y-4">
      <div class="h-8 w-48 animate-pulse rounded-lg bg-line" />
      <div class="h-72 animate-pulse rounded-card bg-line/60" />
    </div>

    <div v-else-if="isError || !progress" class="card mx-auto max-w-md p-8 text-center">
      <p class="font-bold">Тест не найден</p>
      <p class="mt-1 text-ink-soft">Возможно, он недоступен вам или был удалён.</p>
      <RouterLink to="/" class="mt-4 inline-block font-semibold text-brand hover:underline">
        На главную
      </RouterLink>
    </div>

    <template v-else>
      <RouterLink
        v-if="progress.status !== 2"
        :to="{ name: 'course', params: { id: progress.course_id } }"
        class="mb-6 inline-flex items-center gap-1 text-sm font-medium text-ink-soft transition hover:text-ink"
      >
        <Icon name="chevron-left" size="18" />
        К курсу
      </RouterLink>

      <TestRunner v-if="progress.status === 2" :key="progress.id" :progress="progress" />
      <TestResult v-else-if="progress.status === 3" :progress="progress" />
      <TestIntro v-else :key="progress.id" :progress="progress" />
    </template>
  </main>
</template>
