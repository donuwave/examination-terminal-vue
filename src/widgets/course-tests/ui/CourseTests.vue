<script setup lang="ts">
import { computed } from 'vue'
import { courseColor, type CourseDetails } from '@/entities/course'
import { StatusChip, useTestProgress, type TestProgress } from '@/entities/test-progress'
import { formatDeadline, pluralize } from '@/shared/lib'

const props = defineProps<{ course: CourseDetails; viewer: 'student' | 'teacher' }>()

const { data: progress } = useTestProgress()

/** Последняя попытка студента по каждому тесту курса. */
const progressByTest = computed(() => {
  const map = new Map<number, TestProgress>()
  for (const item of progress.value ?? []) {
    const known = map.get(item.test.id)
    if (!known || item.id > known.id) map.set(item.test.id, item)
  }
  return map
})

const progressOf = (testId: number) =>
  props.viewer === 'student' ? progressByTest.value.get(testId) : undefined

const minutes = (seconds: number) => Math.max(1, Math.round(seconds / 60))

const percent = (item: TestProgress) =>
  item.result_test.length
    ? Math.round(((item.count_current_answer ?? 0) / item.result_test.length) * 100)
    : 0
</script>

<template>
  <section>
    <div class="flex items-baseline justify-between gap-3">
      <h2 class="text-2xl font-extrabold tracking-tight">Тесты</h2>
      <span class="text-sm text-ink-soft">
        {{ course.tests.length }} {{ pluralize(course.tests.length, ['тест', 'теста', 'тестов']) }}
      </span>
    </div>

    <ul v-if="course.tests.length" class="mt-5 space-y-3">
      <li
        v-for="test in course.tests"
        :key="test.id"
        class="card flex items-center gap-5 p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_rgba(31,36,48,.14)]"
      >
        <div
          class="grid h-16 w-16 shrink-0 place-content-center rounded-2xl text-center"
          :class="courseColor(course.id)"
        >
          <p class="text-2xl font-extrabold leading-none tabular-nums">
            {{ minutes(test.time_limit) }}
          </p>
          <p class="mt-1 text-[11px] font-medium text-ink/70">мин</p>
        </div>

        <div class="min-w-0 flex-1">
          <p class="text-lg font-bold">{{ test.name }}</p>

          <template v-if="progressOf(test.id)">
            <div v-if="progressOf(test.id)!.status === 3" class="mt-2 flex items-center gap-3">
              <div class="h-2 w-40 max-w-full overflow-hidden rounded-full bg-line">
                <div
                  class="h-full rounded-full bg-emerald-400"
                  :style="{ width: `${percent(progressOf(test.id)!)}%` }"
                />
              </div>
              <span class="text-sm font-semibold">
                {{ progressOf(test.id)!.count_current_answer ?? 0 }} из
                {{ progressOf(test.id)!.result_test.length }}
              </span>
            </div>
            <p v-else class="mt-1 text-sm text-ink-soft">
              до {{ formatDeadline(progressOf(test.id)!.deadline_date) }}
            </p>
          </template>
        </div>

        <template v-if="viewer === 'student'">
          <StatusChip v-if="progressOf(test.id)" :status="progressOf(test.id)!.status" />
          <span
            v-else
            class="inline-flex shrink-0 rounded-full bg-canvas px-2.5 py-1 text-xs font-semibold text-ink-soft"
          >
            Доступ не открыт
          </span>
        </template>
        <span
          v-else
          class="inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold"
          :class="test.access_test ? 'bg-pastel-mint text-emerald-800' : 'bg-canvas text-ink-soft'"
        >
          {{ test.access_test ? 'Доступ открыт' : 'Доступ закрыт' }}
        </span>
      </li>
    </ul>

    <p v-else class="card mt-5 p-6 text-ink-soft">В этом курсе пока нет тестов.</p>
  </section>
</template>
