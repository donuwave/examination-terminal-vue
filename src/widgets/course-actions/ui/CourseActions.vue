<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDeleteCourse, useLeaveCourse, type CourseDetails } from '@/entities/course'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'
import { Icon } from '@/shared/ui/icon'

const props = defineProps<{ course: CourseDetails; viewer: 'student' | 'teacher' }>()

const router = useRouter()
const confirmOpen = ref(false)

const { mutate: leave, isPending: isLeaving } = useLeaveCourse()
const { mutate: remove, isPending: isDeleting } = useDeleteCourse()

const isStudent = props.viewer === 'student'

const texts = isStudent
  ? {
      button: 'Покинуть курс',
      title: 'Покинуть курс?',
      text: `Вы перестанете видеть «${props.course.name}» и его тесты. Вернуться сможет только преподаватель.`,
      confirm: 'Покинуть',
    }
  : {
      button: 'Удалить курс',
      title: 'Удалить курс?',
      text: `«${props.course.name}» будет удалён вместе с тестами и студентами. Это нельзя отменить.`,
      confirm: 'Удалить',
    }

const onConfirm = () => {
  const done = { onSuccess: () => router.replace({ name: 'home' }) }
  if (isStudent) leave(props.course.id, done)
  else remove(props.course.id, done)
}
</script>

<template>
  <button
    type="button"
    class="flex w-full items-center justify-center gap-2 rounded-2xl border border-ink/10 bg-white/50 px-4 py-3 text-sm font-semibold text-red-700 transition duration-200 hover:-translate-y-0.5 hover:bg-white/80 active:scale-[.98]"
    @click="confirmOpen = true"
  >
    <Icon name="logout" size="18" />
    {{ texts.button }}
  </button>

  <ConfirmDialog
    v-model="confirmOpen"
    :title="texts.title"
    :text="texts.text"
    :confirm-label="texts.confirm"
    :loading="isLeaving || isDeleting"
    @confirm="onConfirm"
  />
</template>
