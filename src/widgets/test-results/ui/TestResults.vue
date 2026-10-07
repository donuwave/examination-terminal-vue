<script setup lang="ts">
import { computed, ref } from 'vue'
import { courseColor, personInitials, personName } from '@/entities/course'
import { useTestResults, type ProgressStatus, type TestResultRow } from '@/entities/test-progress'
import { formatDeadline, pluralize } from '@/shared/lib'

const props = defineProps<{ courseId: number; testId: number }>()

const { data: rows, isPending } = useTestResults(
  () => props.courseId,
  () => props.testId,
)

const statuses: Record<ProgressStatus, { label: string; chip: string }> = {
  1: { label: 'Не начал', chip: 'bg-canvas text-ink-soft' },
  2: { label: 'Проходит', chip: 'bg-pastel-peach text-amber-800' },
  3: { label: 'Сдал', chip: 'bg-pastel-mint text-emerald-800' },
  4: { label: 'Просрочил', chip: 'bg-pastel-rose text-red-800' },
}

type Filter = 'all' | ProgressStatus
const filter = ref<Filter>('all')

const countBy = (status: ProgressStatus) =>
  (rows.value ?? []).filter((r) => r.status === status).length

const finished = computed(() => (rows.value ?? []).filter((r) => r.status === 3))
const average = computed(() => {
  const list = finished.value.filter((r) => r.questions_total)
  if (!list.length) return null
  const sum = list.reduce((acc, r) => acc + (r.count_current_answer ?? 0) / r.questions_total, 0)
  return Math.round((sum / list.length) * 100)
})

const summary = computed(() => [
  { label: 'Сдали', value: `${finished.value.length} из ${rows.value?.length ?? 0}` },
  { label: 'Средний результат', value: average.value === null ? '—' : `${average.value}%` },
  { label: 'Проходят сейчас', value: String(countBy(2)) },
  { label: 'Не сдали', value: String(countBy(1) + countBy(4)) },
])

const filters = computed(() => [
  { value: 'all' as Filter, label: 'Все', count: rows.value?.length ?? 0 },
  { value: 3 as Filter, label: 'Сдали', count: countBy(3) },
  { value: 2 as Filter, label: 'Проходят', count: countBy(2) },
  { value: 1 as Filter, label: 'Не начали', count: countBy(1) },
  { value: 4 as Filter, label: 'Просрочили', count: countBy(4) },
])

/** Сначала сдавшие по убыванию балла, затем проходящие, не начавшие и просрочившие. */
const ORDER: Record<ProgressStatus, number> = { 3: 0, 2: 1, 1: 2, 4: 3 }

const visible = computed(() =>
  (rows.value ?? [])
    .filter((r) => filter.value === 'all' || r.status === filter.value)
    .sort((a, b) => {
      if (ORDER[a.status] !== ORDER[b.status]) return ORDER[a.status] - ORDER[b.status]
      const score = (r: TestResultRow) => (r.count_current_answer ?? 0) / (r.questions_total || 1)
      if (a.status === 3) return score(b) - score(a)
      return personName(a.student).localeCompare(personName(b.student), 'ru')
    }),
)

const percent = (row: TestResultRow) =>
  row.questions_total
    ? Math.round(((row.count_current_answer ?? 0) / row.questions_total) * 100)
    : 0
</script>

<template>
  <div>
    <div v-if="isPending" class="space-y-4">
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="n in 4" :key="n" class="h-[88px] animate-pulse rounded-card bg-line/60" />
      </div>
      <div class="h-64 animate-pulse rounded-card bg-line/60" />
    </div>

    <template v-else-if="rows">
      <dl class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="item in summary" :key="item.label" class="card px-5 py-4">
          <dt class="text-sm text-ink-soft">{{ item.label }}</dt>
          <dd class="mt-1 text-3xl font-extrabold tabular-nums">{{ item.value }}</dd>
        </div>
      </dl>

      <div class="mt-6 flex flex-wrap gap-2" role="group" aria-label="Фильтр по статусу">
        <button
          v-for="item in filters"
          :key="String(item.value)"
          type="button"
          class="rounded-full border px-4 py-2 text-sm font-medium transition duration-200 active:scale-[.97]"
          :class="
            filter === item.value
              ? 'border-brand bg-brand-soft text-brand'
              : 'border-line bg-white hover:border-ink/20'
          "
          :aria-pressed="filter === item.value"
          @click="filter = item.value"
        >
          {{ item.label }}
          <span class="ml-1 tabular-nums opacity-60">{{ item.count }}</span>
        </button>
      </div>

      <ul v-if="visible.length" class="card mt-4 divide-y divide-line px-5">
        <li
          v-for="row in visible"
          :key="row.progress_id"
          class="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3 py-4 md:grid-cols-[minmax(0,1.4fr)_6rem_minmax(0,1fr)_7.5rem]"
        >
          <div class="flex min-w-0 items-center gap-3">
            <span
              class="grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold"
              :class="courseColor(row.student.id)"
            >
              {{ personInitials(row.student) }}
            </span>
            <div class="min-w-0">
              <p class="truncate font-semibold">{{ personName(row.student) }}</p>
              <p class="truncate text-sm text-ink-soft">{{ row.student.email }}</p>
            </div>
          </div>

          <span
            class="inline-flex shrink-0 justify-self-start rounded-full px-2.5 py-1 text-xs font-semibold md:justify-self-start"
            :class="statuses[row.status].chip"
          >
            {{ statuses[row.status].label }}
          </span>

          <div class="col-span-2 min-w-0 md:col-span-1">
            <template v-if="row.status === 3">
              <div class="flex items-center gap-3">
                <div class="h-2 flex-1 overflow-hidden rounded-full bg-line">
                  <div
                    class="h-full rounded-full"
                    :class="percent(row) >= 60 ? 'bg-emerald-400' : 'bg-amber-400'"
                    :style="{ width: `${percent(row)}%` }"
                  />
                </div>
                <span class="shrink-0 text-sm font-bold tabular-nums">
                  {{ row.count_current_answer ?? 0 }} из {{ row.questions_total }}
                </span>
              </div>
            </template>
            <span v-else class="text-sm text-ink-soft">
              {{ row.questions_total }}
              {{ pluralize(row.questions_total, ['вопрос', 'вопроса', 'вопросов']) }}
            </span>
          </div>

          <p class="col-span-2 text-sm text-ink-soft md:col-span-1 md:text-right">
            {{ row.attempt_date ? formatDeadline(row.attempt_date) : '—' }}
          </p>
        </li>
      </ul>

      <div v-else class="card mt-4 px-6 py-10 text-center">
        <p class="font-bold">В этой категории никого нет</p>
        <p class="mt-1 text-sm text-ink-soft">
          Выберите другой статус или откройте все результаты.
        </p>
      </div>
    </template>
  </div>
</template>
