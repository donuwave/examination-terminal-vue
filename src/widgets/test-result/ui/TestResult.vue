<script setup lang="ts">
import { computed } from 'vue'
import type { TestProgress } from '@/entities/test-progress'
import { Icon } from '@/shared/ui/icon'

const props = defineProps<{ progress: TestProgress }>()

const total = computed(() => props.progress.result_test.length)
const correct = computed(() => props.progress.count_current_answer ?? 0)
const percent = computed(() => (total.value ? Math.round((correct.value / total.value) * 100) : 0))

const verdict = computed(() => {
  if (percent.value >= 85) return 'Отличный результат'
  if (percent.value >= 60) return 'Хороший результат'
  if (percent.value >= 40) return 'Можно лучше'
  return 'Стоит повторить материал'
})

const tone = computed(() =>
  percent.value >= 60 ? 'bg-pastel-mint text-emerald-900' : 'bg-pastel-peach text-amber-900',
)
</script>

<template>
  <div class="mx-auto max-w-3xl">
    <section class="card p-8">
      <p class="text-sm font-medium text-ink-soft">{{ progress.test.name }}</p>
      <div class="mt-4 flex flex-wrap items-center gap-6">
        <div
          class="grid h-28 w-28 shrink-0 place-content-center rounded-3xl text-center"
          :class="tone"
        >
          <p class="text-4xl font-extrabold leading-none tabular-nums">{{ correct }}</p>
          <p class="mt-1 text-sm font-medium">из {{ total }}</p>
        </div>
        <div class="min-w-0">
          <h1 class="text-3xl font-extrabold tracking-tight">{{ verdict }}</h1>
          <p class="mt-1 text-ink-soft">Верных ответов: {{ percent }}%</p>
        </div>
      </div>
      <div class="mt-6 h-2.5 overflow-hidden rounded-full bg-line">
        <div
          class="h-full rounded-full bg-emerald-400 transition-[width] duration-700"
          :style="{ width: `${percent}%` }"
        />
      </div>
    </section>

    <h2 class="mt-10 text-2xl font-extrabold tracking-tight">Разбор ответов</h2>
    <ul class="mt-5 space-y-3">
      <li v-for="(item, index) in progress.result_test" :key="item.id" class="card p-5">
        <div class="flex items-start gap-3">
          <span
            class="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-white"
            :class="item.student_answer === item.correct_answer ? 'bg-emerald-500' : 'bg-red-500'"
          >
            <Icon :name="item.student_answer === item.correct_answer ? 'check' : 'x'" size="16" />
          </span>
          <div class="min-w-0">
            <p class="font-bold">{{ index + 1 }}. {{ item.text_question }}</p>
            <p class="mt-2 text-sm">
              <span class="text-ink-soft">Ваш ответ: </span>
              <span
                class="font-semibold"
                :class="
                  item.student_answer === item.correct_answer ? 'text-emerald-700' : 'text-red-600'
                "
              >
                {{ item.student_answer ?? 'нет ответа' }}
              </span>
            </p>
            <p v-if="item.student_answer !== item.correct_answer" class="mt-0.5 text-sm">
              <span class="text-ink-soft">Правильно: </span>
              <span class="font-semibold text-emerald-700">{{ item.correct_answer }}</span>
            </p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
