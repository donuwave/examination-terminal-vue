<script setup lang="ts">
import { courseColor, personInitials, personName, type CourseDetails } from '@/entities/course'
import { pluralize } from '@/shared/lib'

defineProps<{ course: CourseDetails }>()
</script>

<template>
  <section class="mt-10">
    <div class="flex items-baseline justify-between gap-3">
      <h2 class="text-2xl font-extrabold tracking-tight">Студенты</h2>
      <span class="text-sm text-ink-soft">
        {{ course.students.length }}
        {{ pluralize(course.students.length, ['человек', 'человека', 'человек']) }}
      </span>
    </div>

    <ul v-if="course.students.length" class="mt-5 grid gap-3 sm:grid-cols-2">
      <li
        v-for="student in course.students"
        :key="student.id"
        class="card flex items-center gap-3 p-4"
      >
        <span
          class="grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold"
          :class="courseColor(student.id)"
        >
          {{ personInitials(student) }}
        </span>
        <div class="min-w-0">
          <p class="truncate font-semibold">{{ personName(student) }}</p>
          <p class="truncate text-sm text-ink-soft">{{ student.email }}</p>
        </div>
      </li>
    </ul>

    <p v-else class="card mt-5 p-6 text-ink-soft">В курс пока никого не добавили.</p>
  </section>
</template>
