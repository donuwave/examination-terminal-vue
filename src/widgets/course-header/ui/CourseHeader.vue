<script setup lang="ts">
import { computed } from 'vue'
import { courseColor, personInitials, personName, type CourseDetails } from '@/entities/course'
import { useTestProgress } from '@/entities/test-progress'

const props = defineProps<{ course: CourseDetails; viewer: 'student' | 'teacher' }>()

const { data: progress } = useTestProgress()

const stats = computed(() => {
  const { course } = props
  const base = [
    { label: 'Студентов', value: course.students.length },
    { label: 'Тестов', value: course.tests.length },
  ]

  if (props.viewer === 'teacher') {
    const open = course.tests.filter((test) => test.access_test).length
    return [...base, { label: 'Доступ открыт', value: `${open} из ${course.tests.length}` }]
  }

  const testIds = new Set(course.tests.map((test) => test.id))
  const done = (progress.value ?? []).filter(
    (item) => item.status === 3 && testIds.has(item.test.id),
  ).length
  return [...base, { label: 'Пройдено', value: `${done} из ${course.tests.length}` }]
})
</script>

<template>
  <aside class="flex flex-col rounded-card p-7 lg:min-h-[560px]" :class="courseColor(course.id)">
    <span
      v-if="course.category"
      class="mb-3 inline-flex rounded-full bg-white/60 px-3 py-1 text-xs font-semibold"
    >
      {{ course.category.name }}
    </span>
    <h1 class="text-3xl font-extrabold leading-tight tracking-tight">{{ course.name }}</h1>
    <p class="mt-4 leading-relaxed text-ink/75">{{ course.description }}</p>

    <div class="mt-8 flex items-center gap-4 border-t border-ink/10 pt-6">
      <span
        class="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white/70 text-base font-bold"
      >
        {{ personInitials(course.teacher) }}
      </span>
      <div class="min-w-0">
        <p class="text-xs text-ink/60">Преподаватель</p>
        <p class="break-words text-lg font-bold leading-snug">{{ personName(course.teacher) }}</p>
        <p class="break-all text-sm text-ink/60">{{ course.teacher.email }}</p>
      </div>
    </div>

    <dl class="mt-6 space-y-2">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="flex items-center justify-between gap-3 rounded-2xl bg-white/60 px-4 py-3.5"
      >
        <dt class="text-sm text-ink/70">{{ stat.label }}</dt>
        <dd class="text-xl font-extrabold tabular-nums">{{ stat.value }}</dd>
      </div>
    </dl>

    <div class="mt-auto pt-8">
      <slot name="actions" />
    </div>
  </aside>
</template>
