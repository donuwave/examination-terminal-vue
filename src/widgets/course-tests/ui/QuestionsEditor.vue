<script setup lang="ts">
import { Icon } from '@/shared/ui/icon'
import { emptyQuestion, MAX_OPTIONS, MIN_OPTIONS, type QuestionForm } from '../model/questions'

defineProps<{ errors: string[] }>()

const questions = defineModel<QuestionForm[]>({ required: true })

const addQuestion = () => questions.value.push(emptyQuestion())
const removeQuestion = (index: number) => questions.value.splice(index, 1)

const addOption = (question: QuestionForm) => question.options.push('')

const removeOption = (question: QuestionForm, index: number) => {
  question.options.splice(index, 1)
  if (question.correct === index) question.correct = null
  else if (question.correct !== null && question.correct > index) question.correct -= 1
}
</script>

<template>
  <div>
    <ul class="space-y-3">
      <li
        v-for="(question, index) in questions"
        :key="index"
        class="rounded-2xl bg-canvas/70 p-4"
        :class="errors[index] ? 'ring-1 ring-red-300' : ''"
      >
        <div class="flex items-center justify-between gap-3">
          <p class="text-sm font-bold">Вопрос {{ index + 1 }}</p>
          <button
            v-if="questions.length > 1"
            type="button"
            class="rounded-lg p-1.5 text-ink-soft transition hover:bg-white hover:text-red-600"
            :aria-label="`Удалить вопрос ${index + 1}`"
            @click="removeQuestion(index)"
          >
            <Icon name="trash" size="16" />
          </button>
        </div>

        <input
          v-model="question.text"
          type="text"
          placeholder="Текст вопроса"
          class="mt-2 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[15px] outline-none transition duration-200 placeholder:text-ink-soft/60 hover:border-ink/20 focus:border-brand focus:ring-4 focus:ring-brand-soft"
        />

        <ul class="mt-3 space-y-2" role="radiogroup" :aria-label="`Варианты вопроса ${index + 1}`">
          <li
            v-for="(_, optionIndex) in question.options"
            :key="optionIndex"
            class="flex items-center gap-2"
          >
            <button
              type="button"
              role="radio"
              :aria-checked="question.correct === optionIndex"
              :aria-label="`Правильный ответ: вариант ${optionIndex + 1}`"
              :title="question.correct === optionIndex ? 'Правильный ответ' : 'Отметить правильным'"
              class="grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition duration-200"
              :class="
                question.correct === optionIndex
                  ? 'border-emerald-500 bg-emerald-500 text-white'
                  : 'border-ink/20 bg-white text-transparent hover:border-emerald-400'
              "
              @click="question.correct = optionIndex"
            >
              <Icon name="check" size="14" />
            </button>
            <input
              v-model="question.options[optionIndex]"
              type="text"
              :placeholder="`Вариант ${optionIndex + 1}`"
              class="min-w-0 flex-1 rounded-xl border bg-white px-3.5 py-2 text-[15px] outline-none transition duration-200 placeholder:text-ink-soft/60 focus:ring-4"
              :class="
                question.correct === optionIndex
                  ? 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-100'
                  : 'border-line hover:border-ink/20 focus:border-brand focus:ring-brand-soft'
              "
            />
            <button
              v-if="question.options.length > MIN_OPTIONS"
              type="button"
              class="rounded-lg p-1.5 text-ink-soft transition hover:bg-white hover:text-red-600"
              :aria-label="`Удалить вариант ${optionIndex + 1}`"
              @click="removeOption(question, optionIndex)"
            >
              <Icon name="x" size="16" />
            </button>
          </li>
        </ul>

        <button
          v-if="question.options.length < MAX_OPTIONS"
          type="button"
          class="mt-2 text-sm font-semibold text-brand hover:underline"
          @click="addOption(question)"
        >
          Добавить вариант
        </button>

        <p v-if="errors[index]" class="mt-2 text-sm text-red-600">{{ errors[index] }}</p>
      </li>
    </ul>

    <button
      type="button"
      class="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed border-ink/20 px-4 py-3 text-sm font-semibold text-ink-soft transition duration-200 hover:border-brand hover:text-brand"
      @click="addQuestion"
    >
      <Icon name="plus" size="18" />
      Добавить вопрос
    </button>
  </div>
</template>
