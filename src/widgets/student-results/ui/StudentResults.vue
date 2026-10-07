<script setup lang="ts">
import { computed } from 'vue'
import { useTestProgress } from '@/entities/test-progress'

const { data } = useTestProgress()

const finished = computed(() => (data.value ?? []).filter((item) => item.status === 3))

const percent = (correct: number | null, total: number) =>
  total ? Math.round(((correct ?? 0) / total) * 100) : 0
</script>

<template>
  <section v-if="finished.length" class="card p-6">
    <h2 class="text-xl font-extrabold">Результаты</h2>
    <ul class="mt-4 space-y-4">
      <li v-for="item in finished" :key="item.id">
        <div class="flex items-baseline justify-between gap-3">
          <p class="truncate font-bold">{{ item.test.name }}</p>
          <p class="shrink-0 text-sm font-semibold">
            {{ item.count_current_answer ?? 0 }} из {{ item.result_test.length }}
          </p>
        </div>
        <div class="mt-2 h-2.5 overflow-hidden rounded-full bg-line">
          <div
            class="h-full rounded-full bg-pastel-mint ring-1 ring-inset ring-emerald-300"
            :style="{ width: `${percent(item.count_current_answer, item.result_test.length)}%` }"
          />
        </div>
      </li>
    </ul>
  </section>
</template>
