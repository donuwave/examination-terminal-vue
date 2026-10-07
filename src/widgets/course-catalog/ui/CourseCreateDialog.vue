<script setup lang="ts">
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { useCategories, useCreateCourse } from '@/entities/course'
import { BaseButton } from '@/shared/ui/button'
import { BaseDialog } from '@/shared/ui/dialog'
import { BaseInput } from '@/shared/ui/input'
import { BaseTextarea } from '@/shared/ui/textarea'
import { toastSuccess } from '@/shared/ui/toast'
import { courseSchema, type CourseValues } from '../model/schema'

const open = defineModel<boolean>({ default: false })

const router = useRouter()
const { data: categories } = useCategories()
const { mutate, isPending } = useCreateCourse()

const { errors, defineField, handleSubmit, submitCount, resetForm } = useForm<CourseValues>({
  validationSchema: courseSchema,
  initialValues: { name: '', description: '' },
})

// До первой отправки поля не валидируются, дальше проверяются при каждом изменении.
const config = () => ({ validateOnModelUpdate: submitCount.value > 0 })
const [name] = defineField('name', config)
const [description] = defineField('description', config)
const [categoryId] = defineField('categoryId', config)

const onSubmit = handleSubmit((values) => {
  if (isPending.value) return
  mutate(values, {
    onSuccess: ({ id }) => {
      open.value = false
      toastSuccess('Курс создан')
      router.push({ name: 'course', params: { id } })
    },
  })
})

watch(open, (isOpen) => {
  if (!isOpen) resetForm()
})
</script>

<template>
  <BaseDialog v-model="open" title="Новый курс" max-width="max-w-lg">
    <h2 class="text-xl font-extrabold">Новый курс</h2>
    <p class="mt-1 text-sm text-ink-soft">Студентов и тесты можно будет добавить позже.</p>

    <form class="mt-6" novalidate @submit="onSubmit">
      <BaseInput
        v-model="name"
        label="Название"
        placeholder="Например, Линейная алгебра"
        :error="errors.name"
      />
      <BaseTextarea
        v-model="description"
        label="Описание"
        placeholder="О чём курс и чему научатся студенты"
        :rows="4"
        :error="errors.description"
      />

      <div>
        <span class="mb-2 block text-sm font-semibold">Тип курса</span>
        <div class="flex flex-wrap gap-2" role="radiogroup" aria-label="Тип курса">
          <button
            v-for="category in categories"
            :key="category.id"
            type="button"
            role="radio"
            :aria-checked="categoryId === category.id"
            class="rounded-full border px-4 py-2 text-sm font-medium transition duration-200 active:scale-[.97]"
            :class="
              categoryId === category.id
                ? 'border-brand bg-brand-soft text-brand'
                : errors.categoryId
                  ? 'border-red-300 bg-red-50/50 hover:border-red-400'
                  : 'border-line bg-white hover:border-ink/20'
            "
            @click="categoryId = category.id"
          >
            {{ category.name }}
          </button>
        </div>
        <div class="mt-1.5 min-h-5">
          <p v-if="errors.categoryId" class="text-sm leading-5 text-red-600">
            {{ errors.categoryId }}
          </p>
        </div>
      </div>

      <div class="mt-4 grid grid-cols-2 gap-3">
        <BaseButton variant="secondary" :disabled="isPending" @click="open = false">
          Отмена
        </BaseButton>
        <BaseButton type="submit" :loading="isPending">
          {{ isPending ? 'Создаём…' : 'Создать курс' }}
        </BaseButton>
      </div>
    </form>
  </BaseDialog>
</template>
