<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useAttachTests, useCreateTestInCourse, useMyTests, type MyTest } from '@/entities/test'
import { pluralize } from '@/shared/lib'
import { BaseButton } from '@/shared/ui/button'
import { BaseDialog } from '@/shared/ui/dialog'
import { BaseInput } from '@/shared/ui/input'
import { toastSuccess } from '@/shared/ui/toast'
import { emptyQuestion, toDrafts, validateQuestions, type QuestionForm } from '../model/questions'
import QuestionsEditor from './QuestionsEditor.vue'

const props = defineProps<{ courseId: number; existingTestIds: number[] }>()
const open = defineModel<boolean>({ default: false })

const mode = ref<'new' | 'existing'>('new')

const { data: myTests } = useMyTests(open)
const { mutate: create, isPending: isCreating } = useCreateTestInCourse(() => props.courseId)
const { mutate: attach, isPending: isAttaching } = useAttachTests(() => props.courseId)

const name = ref('')
const minutes = ref('')
const questions = ref<QuestionForm[]>([emptyQuestion()])
const submitted = ref(false)
const selected = ref<number[]>([])

const available = computed<MyTest[]>(() =>
  (myTests.value ?? []).filter((test) => !props.existingTestIds.includes(test.id)),
)

const nameError = computed(() => (name.value.trim() ? '' : 'Введите название'))
const minutesError = computed(() => {
  const value = Number(minutes.value)
  return Number.isInteger(value) && value >= 1 && value <= 300 ? '' : 'От 1 до 300 минут'
})
const questionErrors = computed(() => validateQuestions(questions.value))

const showErrors = computed(() => submitted.value)

const submitNew = () => {
  submitted.value = true
  if (nameError.value || minutesError.value || questionErrors.value.some(Boolean)) return
  create(
    {
      name: name.value.trim(),
      minutes: Number(minutes.value),
      questions: toDrafts(questions.value),
    },
    {
      onSuccess: () => {
        open.value = false
        toastSuccess('Тест добавлен в курс')
      },
    },
  )
}

const submitExisting = () => {
  if (!selected.value.length) return
  attach(selected.value, {
    onSuccess: () => {
      open.value = false
      toastSuccess('Тесты добавлены в курс')
    },
  })
}

const toggle = (id: number) => {
  selected.value = selected.value.includes(id)
    ? selected.value.filter((item) => item !== id)
    : [...selected.value, id]
}

watch(open, (isOpen) => {
  if (isOpen) return
  mode.value = 'new'
  name.value = ''
  minutes.value = ''
  questions.value = [emptyQuestion()]
  submitted.value = false
  selected.value = []
})
</script>

<template>
  <BaseDialog v-model="open" title="Добавить тест" max-width="max-w-2xl">
    <h2 class="text-xl font-extrabold">Добавить тест</h2>

    <div class="mt-4 inline-flex rounded-2xl bg-canvas p-1" role="tablist">
      <button
        v-for="tab in [
          { value: 'new', label: 'Создать новый' },
          { value: 'existing', label: 'Из моих тестов' },
        ] as const"
        :key="tab.value"
        type="button"
        role="tab"
        :aria-selected="mode === tab.value"
        class="rounded-xl px-4 py-2 text-sm font-semibold transition duration-200"
        :class="mode === tab.value ? 'bg-white shadow-sm' : 'text-ink-soft hover:text-ink'"
        @click="mode = tab.value"
      >
        {{ tab.label }}
      </button>
    </div>

    <form v-if="mode === 'new'" class="mt-5" novalidate @submit.prevent="submitNew">
      <div class="grid gap-x-4 sm:grid-cols-[1fr_160px]">
        <BaseInput
          v-model="name"
          label="Название"
          placeholder="Например, Основы SQL"
          :error="showErrors ? nameError : ''"
        />
        <BaseInput
          v-model="minutes"
          label="Минут на тест"
          inputmode="numeric"
          :maxlength="3"
          placeholder="15"
          :error="showErrors ? minutesError : ''"
        />
      </div>

      <p class="mb-2 text-sm font-semibold">Вопросы</p>
      <QuestionsEditor v-model="questions" :errors="showErrors ? questionErrors : []" />
      <p class="mt-2 text-xs text-ink-soft">
        Отметьте кружком правильный вариант в каждом вопросе.
      </p>

      <div class="mt-6 grid grid-cols-2 gap-3">
        <BaseButton variant="secondary" :disabled="isCreating" @click="open = false">
          Отмена
        </BaseButton>
        <BaseButton type="submit" :loading="isCreating">
          {{ isCreating ? 'Сохраняем…' : 'Создать тест' }}
        </BaseButton>
      </div>
    </form>

    <div v-else class="mt-5">
      <ul v-if="available.length" class="space-y-2">
        <li v-for="test in available" :key="test.id">
          <label
            class="flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition duration-200"
            :class="
              selected.includes(test.id)
                ? 'border-brand bg-brand-soft/50'
                : 'border-line hover:border-ink/20'
            "
          >
            <input
              type="checkbox"
              class="h-4 w-4 accent-[#2F6BFF]"
              :checked="selected.includes(test.id)"
              @change="toggle(test.id)"
            />
            <span class="min-w-0 flex-1">
              <span class="block font-semibold">{{ test.name }}</span>
              <span class="text-sm text-ink-soft">
                {{ test.questions.length }}
                {{ pluralize(test.questions.length, ['вопрос', 'вопроса', 'вопросов']) }}
                · {{ Math.round(test.time_limit / 60) }} мин
              </span>
            </span>
          </label>
        </li>
      </ul>
      <p v-else class="rounded-2xl bg-canvas px-4 py-6 text-center text-ink-soft">
        Подходящих тестов нет: все ваши тесты уже в этом курсе или вы ещё ничего не создавали.
      </p>

      <div class="mt-6 grid grid-cols-2 gap-3">
        <BaseButton variant="secondary" :disabled="isAttaching" @click="open = false">
          Отмена
        </BaseButton>
        <BaseButton :disabled="!selected.length" :loading="isAttaching" @click="submitExisting">
          Добавить{{ selected.length ? ` (${selected.length})` : '' }}
        </BaseButton>
      </div>
    </div>
  </BaseDialog>
</template>
