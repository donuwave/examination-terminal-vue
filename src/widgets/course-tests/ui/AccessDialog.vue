<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import dayjs from 'dayjs'
import { useOpenAccess } from '@/entities/test'
import { BaseButton } from '@/shared/ui/button'
import { BaseDialog } from '@/shared/ui/dialog'
import { toastSuccess } from '@/shared/ui/toast'

const props = defineProps<{ courseId: number; test: { id: number; name: string } | null }>()
const open = defineModel<boolean>({ default: false })

const FORMAT = 'YYYY-MM-DDTHH:mm'

const { mutate, isPending } = useOpenAccess(() => props.courseId)

const deadline = ref('')
const submitted = ref(false)

const minValue = computed(() => dayjs().add(1, 'minute').format(FORMAT))
const error = computed(() => {
  if (!deadline.value) return 'Укажите дату и время'
  return dayjs(deadline.value).isAfter(dayjs()) ? '' : 'Дедлайн должен быть в будущем'
})

const setPreset = (days: number) => {
  deadline.value = dayjs().add(days, 'day').hour(23).minute(59).format(FORMAT)
}

const submit = () => {
  submitted.value = true
  if (error.value || !props.test) return
  mutate(
    { testId: props.test.id, deadline: dayjs(deadline.value).toDate() },
    {
      onSuccess: () => {
        open.value = false
        toastSuccess('Доступ к тесту открыт')
      },
    },
  )
}

watch(open, (isOpen) => {
  if (isOpen) {
    submitted.value = false
    setPreset(7)
  }
})
</script>

<template>
  <BaseDialog v-model="open" title="Открыть доступ к тесту">
    <h2 class="text-xl font-extrabold">Открыть доступ</h2>
    <p class="mt-1 text-ink-soft">
      «{{ test?.name }}» станет доступен всем студентам курса до указанного срока.
    </p>

    <form class="mt-5" novalidate @submit.prevent="submit">
      <label class="block">
        <span class="mb-2 block text-sm font-semibold">Дедлайн</span>
        <input
          v-model="deadline"
          type="datetime-local"
          :min="minValue"
          class="w-full rounded-2xl border bg-white px-4 py-3.5 text-[15px] outline-none transition duration-200 focus:ring-4"
          :class="
            submitted && error
              ? 'border-red-500 bg-red-50/50 ring-4 ring-red-100'
              : 'border-line hover:border-ink/20 focus:border-brand focus:ring-brand-soft'
          "
        />
      </label>

      <div class="mt-2 flex flex-wrap gap-2">
        <button
          v-for="preset in [
            { days: 1, label: 'Завтра' },
            { days: 3, label: 'Через 3 дня' },
            { days: 7, label: 'Через неделю' },
          ]"
          :key="preset.days"
          type="button"
          class="rounded-full border border-line px-3 py-1.5 text-xs font-medium transition duration-200 hover:border-brand hover:text-brand"
          @click="setPreset(preset.days)"
        >
          {{ preset.label }}
        </button>
      </div>

      <div class="mt-1.5 min-h-5">
        <p v-if="submitted && error" class="text-sm leading-5 text-red-600">{{ error }}</p>
      </div>

      <p class="text-xs text-ink-soft">
        Доступ получат студенты, которые записаны на курс сейчас. Закрыть его позже нельзя.
      </p>

      <div class="mt-6 grid grid-cols-2 gap-3">
        <BaseButton variant="secondary" :disabled="isPending" @click="open = false">
          Отмена
        </BaseButton>
        <BaseButton type="submit" :loading="isPending">
          {{ isPending ? 'Открываем…' : 'Открыть доступ' }}
        </BaseButton>
      </div>
    </form>
  </BaseDialog>
</template>
