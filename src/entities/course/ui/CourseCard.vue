<script setup lang="ts">
import { computed } from 'vue'
import type { CatalogCourse, Course } from '../model/types'
import { courseColor } from '../lib/course-color'
import { personName } from '../lib/person-name'

const props = withDefaults(
  defineProps<{
    course: Course | CatalogCourse
    viewer?: 'student' | 'teacher'
    /** Карточка чужого курса: вместо перехода открывает предпросмотр. */
    preview?: boolean
  }>(),
  { viewer: 'student' },
)

const emit = defineEmits<{ select: [] }>()

const studentsCount = computed(() =>
  'students_count' in props.course ? props.course.students_count : props.course.students.length,
)
const testsCount = computed(() =>
  'tests_count' in props.course ? props.course.tests_count : props.course.tests.length,
)

const classes =
  'card flex min-h-[168px] w-full flex-col justify-between p-5 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_rgba(31,36,48,.14)] focus-visible:outline-2 focus-visible:outline-brand'
</script>

<template>
  <component
    :is="preview ? 'button' : 'RouterLink'"
    v-bind="preview ? { type: 'button' } : { to: `/courses/${course.id}` }"
    :class="classes"
    @click="preview && emit('select')"
  >
    <div>
      <div class="flex items-center justify-between gap-3">
        <span class="block h-2.5 w-9 rounded-full" :class="courseColor(course.id)" />
        <span v-if="course.category" class="truncate text-xs font-medium text-ink-soft">
          {{ course.category.name }}
        </span>
      </div>
      <h3 class="mt-4 text-lg font-extrabold leading-snug">{{ course.name }}</h3>
      <p class="mt-1 line-clamp-2 text-sm text-ink-soft">{{ course.description }}</p>
    </div>
    <div class="mt-4 flex items-center justify-between gap-3 text-sm">
      <span class="truncate text-ink-soft">
        {{ viewer === 'teacher' ? `${studentsCount} студ.` : personName(course.teacher) }}
      </span>
      <span class="shrink-0 rounded-full bg-canvas px-2.5 py-1 text-xs font-semibold">
        {{ testsCount }} тест.
      </span>
    </div>
  </component>
</template>
