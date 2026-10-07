<script setup lang="ts">
import { ref, watch } from 'vue'
import { useForm } from 'vee-validate'
import { useCreateMaterial } from '@/entities/material'
import { formatFileSize } from '@/shared/lib'
import { BaseButton } from '@/shared/ui/button'
import { BaseDialog } from '@/shared/ui/dialog'
import { Icon } from '@/shared/ui/icon'
import { BaseInput } from '@/shared/ui/input'
import { BaseTextarea } from '@/shared/ui/textarea'
import { MAX_FILE_SIZE, MAX_FILES, materialSchema, type MaterialValues } from '../model/schema'

const props = defineProps<{ courseId: number }>()
const open = defineModel<boolean>({ default: false })

const { mutate, isPending } = useCreateMaterial(() => props.courseId)

const { errors, defineField, handleSubmit, submitCount, resetForm } = useForm<MaterialValues>({
  validationSchema: materialSchema,
  initialValues: { title: '', description: '' },
})

// До первой отправки поля не валидируются, дальше проверяются при каждом изменении.
const config = () => ({ validateOnModelUpdate: submitCount.value > 0 })
const [title] = defineField('title', config)
const [description] = defineField('description', config)

const files = ref<File[]>([])
const fileError = ref('')
const picker = ref<HTMLInputElement>()
const dragging = ref(false)

const addFiles = (incoming: FileList | File[]) => {
  fileError.value = ''
  const next = [...files.value]
  for (const file of incoming) {
    if (file.size > MAX_FILE_SIZE) {
      fileError.value = `«${file.name}» больше ${MAX_FILE_SIZE / 1024 / 1024} МБ`
      continue
    }
    if (next.length >= MAX_FILES) {
      fileError.value = `Не больше ${MAX_FILES} файлов`
      break
    }
    next.push(file)
  }
  files.value = next
}

const onPick = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) addFiles(input.files)
  input.value = ''
}

const onDrop = (event: DragEvent) => {
  dragging.value = false
  if (event.dataTransfer?.files) addFiles(event.dataTransfer.files)
}

const removeFile = (index: number) => {
  files.value = files.value.filter((_, position) => position !== index)
  fileError.value = ''
}

const onSubmit = handleSubmit((values) => {
  if (isPending.value) return
  mutate(
    { title: values.title, description: values.description ?? '', files: files.value },
    { onSuccess: () => (open.value = false) },
  )
})

watch(open, (isOpen) => {
  if (isOpen) return
  resetForm()
  files.value = []
  fileError.value = ''
})
</script>

<template>
  <BaseDialog v-model="open" title="Новый материал" max-width="max-w-lg">
    <h2 class="text-xl font-extrabold">Новый материал</h2>
    <p class="mt-1 text-sm text-ink-soft">Студенты курса увидят его у себя на странице.</p>

    <form class="mt-6" novalidate @submit="onSubmit">
      <BaseInput
        v-model="title"
        label="Заголовок"
        placeholder="Например, Введение в SQL"
        :error="errors.title"
      />
      <BaseTextarea
        v-model="description"
        label="Описание"
        placeholder="Что нужно изучить, на что обратить внимание"
        :rows="5"
        :error="errors.description"
      />

      <div>
        <span class="mb-2 flex items-baseline justify-between text-sm font-semibold">
          Файлы
          <span class="font-normal text-ink-soft">до {{ MAX_FILES }} шт., по 10 МБ</span>
        </span>

        <button
          type="button"
          class="flex w-full flex-col items-center gap-1 rounded-2xl border border-dashed px-4 py-5 text-sm transition duration-200"
          :class="
            dragging
              ? 'border-brand bg-brand-soft/50 text-brand'
              : 'border-ink/20 text-ink-soft hover:border-brand hover:text-brand'
          "
          @click="picker?.click()"
          @dragover.prevent="dragging = true"
          @dragleave="dragging = false"
          @drop.prevent="onDrop"
        >
          <Icon name="upload" size="22" />
          <span class="font-semibold">Выберите файлы или перетащите сюда</span>
        </button>
        <input ref="picker" type="file" multiple class="hidden" @change="onPick" />

        <ul v-if="files.length" class="mt-3 space-y-2">
          <li
            v-for="(file, index) in files"
            :key="`${file.name}-${index}`"
            class="flex items-center gap-3 rounded-xl bg-canvas px-3 py-2.5 text-sm"
          >
            <Icon name="file" size="18" class="text-ink-soft" />
            <span class="min-w-0 flex-1 truncate font-medium">{{ file.name }}</span>
            <span class="shrink-0 text-ink-soft">{{ formatFileSize(file.size) }}</span>
            <button
              type="button"
              class="rounded-lg p-1 text-ink-soft transition hover:bg-white hover:text-red-600"
              :aria-label="`Убрать ${file.name}`"
              @click="removeFile(index)"
            >
              <Icon name="x" size="16" />
            </button>
          </li>
        </ul>

        <div class="mt-1.5 min-h-5">
          <p v-if="fileError" class="text-sm leading-5 text-red-600">{{ fileError }}</p>
        </div>
      </div>

      <div class="mt-4 grid grid-cols-2 gap-3">
        <BaseButton variant="secondary" :disabled="isPending" @click="open = false">
          Отмена
        </BaseButton>
        <BaseButton type="submit" :loading="isPending">
          {{ isPending ? 'Сохраняем…' : 'Добавить' }}
        </BaseButton>
      </div>
    </form>
  </BaseDialog>
</template>
