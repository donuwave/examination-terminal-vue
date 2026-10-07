<script setup lang="ts">
import { ref } from 'vue'
import {
  courseColor,
  personInitials,
  personName,
  useRemoveStudent,
  type CourseDetails,
  type CourseStudent,
} from '@/entities/course'
import { pluralize } from '@/shared/lib'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'
import { Icon } from '@/shared/ui/icon'
import { toastSuccess } from '@/shared/ui/toast'

const props = defineProps<{ course: CourseDetails }>()

const removeOpen = ref(false)
const toRemove = ref<CourseStudent | null>(null)

const { mutate: remove, isPending: isRemoving } = useRemoveStudent(() => props.course.id)

const askRemove = (student: CourseStudent) => {
  toRemove.value = student
  removeOpen.value = true
}

const confirmRemove = () => {
  if (!toRemove.value) return
  remove(toRemove.value.id, {
    onSuccess: () => {
      removeOpen.value = false
      toastSuccess('Студент убран из курса')
    },
  })
}
</script>

<template>
  <section class="mt-10">
    <div class="flex items-center justify-between gap-3">
      <h2 class="text-2xl font-extrabold tracking-tight">Студенты</h2>
      <div class="flex items-center gap-3">
        <span class="text-sm text-ink-soft">
          {{ course.students.length }}
          {{ pluralize(course.students.length, ['человек', 'человека', 'человек']) }}
        </span>
      </div>
    </div>

    <ul v-if="course.students.length" class="mt-5 grid gap-3 sm:grid-cols-2">
      <li
        v-for="student in course.students"
        :key="student.id"
        class="card group flex items-center gap-3 p-4"
      >
        <span
          class="grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold"
          :class="courseColor(student.id)"
        >
          {{ personInitials(student) }}
        </span>
        <div class="min-w-0 flex-1">
          <p class="truncate font-semibold">{{ personName(student) }}</p>
          <p class="truncate text-sm text-ink-soft">{{ student.email }}</p>
        </div>
        <button
          type="button"
          class="shrink-0 rounded-lg p-2 text-ink-soft opacity-60 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 focus-visible:opacity-100"
          :aria-label="`Убрать из курса: ${personName(student)}`"
          @click="askRemove(student)"
        >
          <Icon name="trash" size="18" />
        </button>
      </li>
    </ul>

    <div v-else class="card mt-5 flex flex-col items-center px-6 py-8 text-center">
      <p class="font-bold">В курсе пока никого нет</p>
      <p class="mt-1 text-sm text-ink-soft">
        Студенты записываются на курс сами через каталог «Все курсы».
      </p>
    </div>

    <ConfirmDialog
      v-model="removeOpen"
      title="Убрать студента?"
      :text="`${toRemove ? personName(toRemove) : ''} перестанет видеть курс. Его результаты сохранятся.`"
      confirm-label="Убрать"
      :loading="isRemoving"
      @confirm="confirmRemove"
    />
  </section>
</template>
