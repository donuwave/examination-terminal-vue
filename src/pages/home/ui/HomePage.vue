<script setup lang="ts">
import { computed } from 'vue'
import { useProfile } from '@/entities/profile'
import { StudentCourses } from '@/widgets/student-courses'
import { StudentDeadlines } from '@/widgets/student-deadlines'
import { StudentResults } from '@/widgets/student-results'
import { TeacherCourses } from '@/widgets/teacher-courses'

const { data: profile } = useProfile()

const name = computed(() => profile.value?.first_name || profile.value?.email.split('@')[0] || '')
const isStudent = computed(() => profile.value?.role.name === 'Студент')
const isTeacher = computed(() => profile.value?.role.name === 'Преподаватель')
</script>

<template>
  <div>
    <header class="reveal">
      <h1 class="text-3xl font-extrabold tracking-tight">Привет, {{ name }}</h1>
      <p class="mt-1 text-ink-soft">Вот что у вас на ближайшее время</p>
    </header>

    <div v-if="isStudent" class="reveal mt-8 space-y-8" style="--d: 80ms">
      <StudentDeadlines />
      <StudentCourses />
      <StudentResults />
    </div>

    <div v-else-if="isTeacher" class="reveal mt-8" style="--d: 80ms">
      <TeacherCourses />
    </div>
  </div>
</template>
