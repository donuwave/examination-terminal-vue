import type { QuestionDraft } from '@/entities/test'

export const MIN_OPTIONS = 2
export const MAX_OPTIONS = 6

/** Вопрос в редакторе: правильный ответ хранится индексом, чтобы переименование варианта его не теряло. */
export interface QuestionForm {
  text: string
  options: string[]
  correct: number | null
}

export const emptyQuestion = (): QuestionForm => ({
  text: '',
  options: ['', '', '', ''],
  correct: null,
})

/** Текст ошибки для каждого вопроса; пустая строка, если вопрос заполнен верно. */
export const validateQuestions = (questions: QuestionForm[]): string[] =>
  questions.map((question) => {
    if (!question.text.trim()) return 'Введите текст вопроса'

    const filled = question.options.map((option) => option.trim()).filter(Boolean)
    if (filled.length < MIN_OPTIONS) return 'Нужно минимум два варианта ответа'
    if (new Set(filled).size !== filled.length) return 'Варианты ответа не должны повторяться'

    const correct = question.correct === null ? '' : question.options[question.correct]?.trim()
    if (!correct) return 'Отметьте правильный ответ'
    return ''
  })

export const toDrafts = (questions: QuestionForm[]): QuestionDraft[] =>
  questions.map((question) => {
    const options = question.options.map((option) => option.trim()).filter(Boolean)
    return {
      text_question: question.text.trim(),
      options,
      correct_answer: question.options[question.correct ?? 0].trim(),
    }
  })
