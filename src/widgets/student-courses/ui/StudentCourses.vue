<script setup lang="ts">
import { CourseCard, useCourses } from '@/entities/course'

const { data: courses, isPending } = useCourses()
</script>

<template>
  <section>
    <div class="flex items-baseline justify-between gap-3">
      <h2 class="text-xl font-extrabold">Мои курсы</h2>
      <RouterLink to="/courses" class="text-sm font-semibold text-brand hover:underline">
        Все курсы
      </RouterLink>
    </div>

    <div v-if="courses?.length" class="mt-4 grid gap-4 sm:grid-cols-2">
      <CourseCard v-for="course in courses" :key="course.id" :course="course" />
    </div>

    <div v-else-if="isPending" class="mt-4 grid gap-4 sm:grid-cols-2">
      <div v-for="n in 2" :key="n" class="h-[168px] animate-pulse rounded-card bg-line" />
    </div>

    <p v-else class="card mt-4 p-6 text-ink-soft">Вас пока не добавили ни на один курс.</p>
  </section>
</template>
