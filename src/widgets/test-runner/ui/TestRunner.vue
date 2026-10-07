<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  useCompleteTest,
  useSaveAnswers,
  type AnswerPayload,
  type TestProgress,
} from '@/entities/test-progress'
import { BaseButton } from '@/shared/ui/button'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'
import { Icon } from '@/shared/ui/icon'
import { toastError } from '@/shared/ui/toast'
import { useCountdown } from '../model/useCountdown'

const props = defineProps<{ progress: TestProgress }>()

const AUTOSAVE_DELAY = 500
const WARNING_SECONDS = 60

const router = useRouter()
const { mutate: save } = useSaveAnswers(() => props.progress.id)
const { mutate: complete, isPending: isCompleting } = useCompleteTest(() => props.progress.id)

const questions = props.progress.result_test
const current = ref(0)

/** Ответы по id вопроса: единственный источник правды на время теста. */
const answers = reactive<Record<number, string | null>>(
  Object.fromEntries(questions.map((q) => [q.id, q.student_answer])),
)

const payload = (): AnswerPayload[] =>
  questions.map((q) => ({ id: q.id, student_answer: answers[q.id] ?? null }))

const answeredCount = computed(() => questions.filter((q) => answers[q.id]).length)
const question = computed(() => questions[current.value])
const isLast = computed(() => current.value === questions.length - 1)

let saveTimer: ReturnType<typeof setTimeout> | undefined
let finished = false
const dirty = ref(false)

const flush = () => {
  clearTimeout(saveTimer)
  if (!dirty.value || finished) return
  dirty.value = false
  save(payload())
}

watch(answers, () => {
  dirty.value = true
  clearTimeout(saveTimer)
  saveTimer = setTimeout(flush, AUTOSAVE_DELAY)
})

const choose = (option: string) => {
  answers[question.value.id] = option
}

const finish = () => {
  if (finished || isCompleting.value) return
  finished = true
  clearTimeout(saveTimer)
  complete(payload(), {
    onError: () => {
      finished = false
      toastError('Не удалось завершить тест. Попробуйте ещё раз')
    },
  })
}

const { left, label } = useCountdown(props.progress.remaining_time ?? 0, finish)

const confirmFinish = ref(false)
const confirmLeave = ref(false)

const leave = () => {
  flush()
  router.push({ name: 'course', params: { id: props.progress.course_id } })
}

onBeforeUnmount(flush)
</script>

<template>
  <div>
    <header class="flex flex-wrap items-center justify-between gap-3">
      <button
        type="button"
        class="inline-flex items-center gap-1 text-sm font-medium text-ink-soft transition hover:text-ink"
        @click="confirmLeave = true"
      >
        <Icon name="chevron-left" size="18" />
        Выйти из теста
      </button>

      <div
        class="inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 font-extrabold tabular-nums transition-colors"
        :class="left <= WARNING_SECONDS ? 'bg-pastel-rose text-red-700' : 'bg-white shadow-card'"
        role="timer"
        :aria-label="`Осталось ${label}`"
      >
        <Icon name="clock" size="20" />
        <span class="text-xl">{{ label }}</span>
      </div>
    </header>

    <h1 class="mt-6 text-2xl font-extrabold tracking-tight">{{ progress.test.name }}</h1>

    <div class="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_280px]">
      <section class="card p-7">
        <p class="text-sm font-medium text-ink-soft">
          Вопрос {{ current + 1 }} из {{ questions.length }}
        </p>
        <h2 class="mt-2 text-2xl font-extrabold leading-snug">{{ question.text_question }}</h2>

        <ul class="mt-6 space-y-3" role="radiogroup" :aria-label="question.text_question">
          <li v-for="(option, index) in question.options" :key="option">
            <button
              type="button"
              role="radio"
              :aria-checked="answers[question.id] === option"
              class="flex w-full items-center gap-4 rounded-2xl border-2 px-5 py-4 text-left transition duration-200 active:scale-[.99]"
              :class="
                answers[question.id] === option
                  ? 'border-brand bg-brand-soft/60'
                  : 'border-line bg-white hover:border-ink/20'
              "
              @click="choose(option)"
            >
              <span
                class="grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold transition-colors"
                :class="
                  answers[question.id] === option
                    ? 'bg-brand text-white'
                    : 'bg-canvas text-ink-soft'
                "
              >
                {{ String.fromCharCode(1040 + index) }}
              </span>
              <span class="text-[17px] font-medium">{{ option }}</span>
            </button>
          </li>
        </ul>

        <div class="mt-8 flex items-center justify-between gap-3">
          <BaseButton
            class="!w-auto"
            variant="secondary"
            :disabled="current === 0"
            @click="current--"
          >
            Назад
          </BaseButton>
          <BaseButton v-if="!isLast" class="!w-auto" @click="current++">Дальше</BaseButton>
          <BaseButton v-else class="!w-auto" @click="confirmFinish = true">Завершить</BaseButton>
        </div>
      </section>

      <aside class="card p-6 lg:sticky lg:top-6">
        <h3 class="font-bold">Вопросы</h3>
        <p class="mt-0.5 text-sm text-ink-soft">
          Отвечено {{ answeredCount }} из {{ questions.length }}
        </p>

        <ul class="mt-4 grid grid-cols-5 gap-2">
          <li v-for="(item, index) in questions" :key="item.id">
            <button
              type="button"
              class="grid h-11 w-full place-items-center rounded-xl border-2 text-sm font-bold tabular-nums transition duration-200"
              :class="[
                current === index ? 'border-ink' : 'border-transparent',
                answers[item.id] ? 'bg-brand text-white' : 'bg-canvas hover:bg-line',
              ]"
              :aria-label="`Вопрос ${index + 1}${answers[item.id] ? ', есть ответ' : ''}`"
              :aria-current="current === index"
              @click="current = index"
            >
              {{ index + 1 }}
            </button>
          </li>
        </ul>

        <BaseButton class="mt-6" variant="secondary" @click="confirmFinish = true">
          Завершить тест
        </BaseButton>
      </aside>
    </div>

    <ConfirmDialog
      v-model="confirmFinish"
      variant="primary"
      title="Завершить тест?"
      :text="
        answeredCount < questions.length
          ? `Вы ответили на ${answeredCount} из ${questions.length}. Остальные вопросы засчитаются как неверные.`
          : 'Ответы будут отправлены на проверку, изменить их после этого нельзя.'
      "
      confirm-label="Завершить"
      :loading="isCompleting"
      @confirm="finish"
    />

    <ConfirmDialog
      v-model="confirmLeave"
      variant="primary"
      title="Выйти из теста?"
      text="Таймер продолжит идти. Вернуться можно до окончания времени, ответы сохранены."
      confirm-label="Выйти"
      cancel-label="Остаться"
      @confirm="leave"
    />
  </div>
</template>
