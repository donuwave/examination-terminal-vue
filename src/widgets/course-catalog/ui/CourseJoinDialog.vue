<script setup lang="ts">
import { useRouter } from 'vue-router'
import { courseColor, personName, useEnrollCourse, type CatalogCourse } from '@/entities/course'
import { pluralize } from '@/shared/lib'
import { BaseButton } from '@/shared/ui/button'
import { BaseDialog } from '@/shared/ui/dialog'
import { toastSuccess } from '@/shared/ui/toast'

const props = defineProps<{ course: CatalogCourse | null; canJoin: boolean }>()
const open = defineModel<boolean>({ default: false })

const router = useRouter()
const { mutate, isPending } = useEnrollCourse()

const join = () => {
  if (!props.course || isPending.value) return
  const { id } = props.course
  mutate(id, {
    onSuccess: () => {
      open.value = false
      toastSuccess('Вы записаны на курс')
      router.push({ name: 'course', params: { id } })
    },
  })
}
</script>

<template>
  <BaseDialog v-model="open" :title="course?.name ?? 'Курс'" max-width="max-w-md">
    <template v-if="course">
      <span class="block h-2.5 w-12 rounded-full" :class="courseColor(course.id)" />
      <span v-if="course.category" class="mt-4 block text-xs font-medium text-ink-soft">
        {{ course.category.name }}
      </span>
      <h2 class="mt-1 text-2xl font-extrabold leading-tight">{{ course.name }}</h2>
      <p class="mt-3 leading-relaxed text-ink/80">{{ course.description }}</p>

      <dl class="mt-5 space-y-2 text-sm">
        <div class="flex justify-between gap-3 rounded-2xl bg-canvas px-4 py-3">
          <dt class="text-ink-soft">Преподаватель</dt>
          <dd class="text-right font-semibold">{{ personName(course.teacher) }}</dd>
        </div>
        <div class="flex justify-between gap-3 rounded-2xl bg-canvas px-4 py-3">
          <dt class="text-ink-soft">Студентов</dt>
          <dd class="font-semibold">{{ course.students_count }}</dd>
        </div>
        <div class="flex justify-between gap-3 rounded-2xl bg-canvas px-4 py-3">
          <dt class="text-ink-soft">Тестов</dt>
          <dd class="font-semibold">
            {{ course.tests_count }}
            {{ pluralize(course.tests_count, ['тест', 'теста', 'тестов']) }}
          </dd>
        </div>
      </dl>

      <p v-if="canJoin" class="mt-4 text-sm text-ink-soft">
        После записи откроются материалы курса. Доступ к тестам открывает преподаватель.
      </p>

      <div class="mt-6 grid gap-3" :class="canJoin ? 'grid-cols-2' : ''">
        <BaseButton variant="secondary" :disabled="isPending" @click="open = false">
          {{ canJoin ? 'Отмена' : 'Закрыть' }}
        </BaseButton>
        <BaseButton v-if="canJoin" :loading="isPending" @click="join">
          {{ isPending ? 'Записываем…' : 'Записаться' }}
        </BaseButton>
      </div>
    </template>
  </BaseDialog>
</template>
