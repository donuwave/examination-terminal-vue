<script setup lang="ts">
import { computed } from 'vue'
import { personInitials, personName, useCourses } from '@/entities/course'
import type { Profile } from '@/entities/profile'
import { useTestProgress } from '@/entities/test-progress'

const props = defineProps<{ profile: Profile }>()

const { data: courses } = useCourses()
const { data: progress } = useTestProgress()

const isTeacher = computed(() => props.profile.role.name === 'Преподаватель')

const stats = computed(() => {
  const list = courses.value ?? []
  if (isTeacher.value) {
    const students = new Set(list.flatMap((course) => course.students.map((s) => s.id)))
    const tests = new Set(list.flatMap((course) => course.tests.map((t) => t.id)))
    return [
      { label: 'Курсов', value: list.length },
      { label: 'Студентов', value: students.size },
      { label: 'Тестов', value: tests.size },
    ]
  }
  const done = (progress.value ?? []).filter((item) => item.status === 3).length
  return [
    { label: 'Курсов', value: list.length },
    { label: 'Пройдено тестов', value: done },
  ]
})
</script>

<template>
  <aside class="card p-7">
    <div class="flex flex-col items-center text-center">
      <span
        class="grid h-24 w-24 place-items-center rounded-full text-3xl font-extrabold"
        :class="isTeacher ? 'bg-pastel-lavender' : 'bg-pastel-sky'"
      >
        {{ personInitials(profile) }}
      </span>
      <h2 class="mt-5 break-words text-2xl font-extrabold leading-tight">
        {{ personName(profile) }}
      </h2>
      <p class="mt-1 break-all text-sm text-ink-soft">{{ profile.email }}</p>
      <span
        class="mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold"
        :class="isTeacher ? 'bg-pastel-lavender text-violet-900' : 'bg-pastel-sky text-sky-900'"
      >
        {{ profile.role.name }}
      </span>
    </div>

    <dl class="mt-7 space-y-2 border-t border-line pt-6">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="flex items-center justify-between gap-3 rounded-2xl bg-canvas px-4 py-3"
      >
        <dt class="text-sm text-ink-soft">{{ stat.label }}</dt>
        <dd class="text-xl font-extrabold tabular-nums">{{ stat.value }}</dd>
      </div>
    </dl>
  </aside>
</template>
