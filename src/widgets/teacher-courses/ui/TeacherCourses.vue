<script setup lang="ts">
import { computed } from 'vue'
import { CourseCard, useCourses } from '@/entities/course'

const { data: courses, isPending } = useCourses()

const stats = computed(() => {
  const list = courses.value ?? []
  const students = new Set(list.flatMap((course) => course.students.map((student) => student.id)))
  const tests = new Set(list.flatMap((course) => course.tests.map((test) => test.id)))
  return [
    { label: 'Курсов', value: list.length },
    { label: 'Студентов', value: students.size },
    { label: 'Тестов', value: tests.size },
  ]
})
</script>

<template>
  <div class="space-y-8">
    <div class="grid gap-4 sm:grid-cols-3">
      <div v-for="stat in stats" :key="stat.label" class="card p-5">
        <p class="text-4xl font-extrabold">{{ stat.value }}</p>
        <p class="mt-1 text-sm text-ink-soft">{{ stat.label }}</p>
      </div>
    </div>

    <section>
      <div class="flex items-baseline justify-between gap-3">
        <h2 class="text-xl font-extrabold">Мои курсы</h2>
        <RouterLink to="/courses" class="text-sm font-semibold text-brand hover:underline">
          Все курсы
        </RouterLink>
      </div>

      <div v-if="courses?.length" class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <CourseCard v-for="course in courses" :key="course.id" :course="course" viewer="teacher" />
      </div>

      <div v-else-if="isPending" class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="n in 3" :key="n" class="h-[168px] animate-pulse rounded-card bg-line" />
      </div>

      <p v-else class="card mt-4 p-6 text-ink-soft">
        У вас пока нет курсов. Создание курсов появится на следующем шаге.
      </p>
    </section>
  </div>
</template>
