<script setup lang="ts">
import { computed, ref } from 'vue'
import { courseColor, type CourseDetails } from '@/entities/course'
import { StatusChip, useTestProgress, type TestProgress } from '@/entities/test-progress'
import { formatDeadline, pluralize } from '@/shared/lib'
import { Icon } from '@/shared/ui/icon'
import AccessDialog from './AccessDialog.vue'
import TestAddDialog from './TestAddDialog.vue'

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

const actionLabel: Partial<Record<number, string>> = {
  1: 'Начать',
  2: 'Продолжить',
  3: 'Результат',
}

const addOpen = ref(false)
const accessOpen = ref(false)
const accessTest = ref<{ id: number; name: string } | null>(null)

const openAccess = (test: { id: number; name: string }) => {
  accessTest.value = test
  accessOpen.value = true
}

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
      <div class="flex items-center gap-3">
        <span class="text-sm text-ink-soft">
          {{ course.tests.length }}
          {{ pluralize(course.tests.length, ['тест', 'теста', 'тестов']) }}
        </span>
        <button
          v-if="viewer === 'teacher'"
          type="button"
          class="inline-flex items-center gap-1.5 rounded-xl bg-brand-soft px-3.5 py-2 text-sm font-semibold text-brand transition duration-200 hover:-translate-y-0.5 active:scale-[.98]"
          @click="addOpen = true"
        >
          <Icon name="plus" size="18" />
          Добавить
        </button>
      </div>
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
          <div v-if="progressOf(test.id)" class="flex shrink-0 items-center gap-3">
            <StatusChip :status="progressOf(test.id)!.status" />
            <RouterLink
              v-if="progressOf(test.id)!.status !== 4"
              :to="`/tests/${progressOf(test.id)!.id}`"
              class="rounded-xl px-4 py-2 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 active:scale-[.98]"
              :class="
                progressOf(test.id)!.status === 3
                  ? 'bg-canvas hover:bg-line'
                  : 'bg-brand text-white shadow-[0_6px_16px_-6px_rgba(47,107,255,.6)]'
              "
            >
              {{ actionLabel[progressOf(test.id)!.status] }}
            </RouterLink>
          </div>
          <span
            v-else
            class="inline-flex shrink-0 rounded-full bg-canvas px-2.5 py-1 text-xs font-semibold text-ink-soft"
          >
            Доступ не открыт
          </span>
        </template>
        <template v-else>
          <div v-if="test.access_test" class="flex shrink-0 items-center gap-3">
            <span
              class="inline-flex rounded-full bg-pastel-mint px-2.5 py-1 text-xs font-semibold text-emerald-800"
            >
              Доступ открыт
            </span>
            <RouterLink
              :to="{ name: 'test-results', params: { id: course.id, testId: test.id } }"
              class="rounded-xl bg-canvas px-4 py-2 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:bg-line active:scale-[.98]"
            >
              Результаты
            </RouterLink>
          </div>
          <button
            v-else
            type="button"
            class="shrink-0 rounded-xl border border-line px-3.5 py-2 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:border-brand hover:text-brand active:scale-[.98]"
            @click="openAccess(test)"
          >
            Открыть доступ
          </button>
        </template>
      </li>
    </ul>

    <div v-else class="card mt-5 flex flex-col items-center px-6 py-8 text-center">
      <p class="font-bold">В этом курсе пока нет тестов</p>
      <p class="mt-1 text-sm text-ink-soft">
        {{
          viewer === 'teacher'
            ? 'Создайте тест с вопросами и откройте к нему доступ.'
            : 'Преподаватель ещё не добавил тесты.'
        }}
      </p>
    </div>

    <template v-if="viewer === 'teacher'">
      <TestAddDialog
        v-model="addOpen"
        :course-id="course.id"
        :existing-test-ids="course.tests.map((test) => test.id)"
      />
      <AccessDialog v-model="accessOpen" :course-id="course.id" :test="accessTest" />
    </template>
  </section>
</template>
