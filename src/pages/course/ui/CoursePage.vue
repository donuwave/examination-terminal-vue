<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCourse } from '@/entities/course'
import { useProfile } from '@/entities/profile'
import { Icon } from '@/shared/ui/icon'
import { CourseActions } from '@/widgets/course-actions'
import { CourseHeader } from '@/widgets/course-header'
import { CourseMaterials } from '@/widgets/course-materials'
import { CourseStudents } from '@/widgets/course-students'
import { CourseTests } from '@/widgets/course-tests'

const route = useRoute()
const { data: course, isPending, isError } = useCourse(() => Number(route.params.id))
const { data: profile } = useProfile()

const viewer = computed(() =>
  profile.value?.role.name === 'Преподаватель' ? 'teacher' : 'student',
)
</script>

<template>
  <div>
    <div v-if="isPending" class="space-y-4">
      <div class="h-6 w-24 animate-pulse rounded-lg bg-line" />
      <div class="h-10 w-2/3 animate-pulse rounded-lg bg-line" />
      <div class="h-64 animate-pulse rounded-card bg-line/60" />
    </div>

    <div v-else-if="isError || !course" class="card p-8 text-center">
      <p class="font-bold">Курс не найден</p>
      <p class="mt-1 text-ink-soft">Возможно, он удалён или у вас нет к нему доступа.</p>
      <RouterLink to="/" class="mt-4 inline-block font-semibold text-brand hover:underline">
        Вернуться на главную
      </RouterLink>
    </div>

    <template v-else>
      <RouterLink
        to="/"
        class="inline-flex items-center gap-1 text-sm font-medium text-ink-soft transition hover:text-ink"
      >
        <Icon name="chevron-left" size="18" />
        Главная
      </RouterLink>

      <div class="reveal mt-5 grid items-start gap-6 lg:grid-cols-[minmax(22rem,30%)_1fr]">
        <CourseHeader :course="course" :viewer="viewer" class="lg:sticky lg:top-8">
          <template #actions>
            <CourseActions :course="course" :viewer="viewer" />
          </template>
        </CourseHeader>

        <div class="min-w-0">
          <CourseMaterials :course-id="course.id" :viewer="viewer" />
          <CourseTests :course="course" :viewer="viewer" class="mt-10" />
          <CourseStudents v-if="viewer === 'teacher'" :course="course" />
        </div>
      </div>
    </template>
  </div>
</template>
