/** 1 — готов к прохождению, 2 — начат, 3 — завершён, 4 — просрочен. */
export type ProgressStatus = 1 | 2 | 3 | 4

export interface ProgressQuestion {
  id: number
  text_question: string
  options: string[]
  /** Приходит только после завершения теста. */
  correct_answer: string | null
  student_answer: string | null
}

export interface TestProgress {
  id: number
  course_id: number
  status: ProgressStatus
  deadline_date: number
  attempt_date: number | null
  count_current_answer: number | null
  timelimit: number
  /** Секунд до конца попытки, пока тест идёт. */
  remaining_time: number | null
  test: { id: number; name: string }
  result_test: ProgressQuestion[]
}

export interface AnswerPayload {
  id: number
  student_answer: string | null
}

/** Строка результатов теста для преподавателя: один студент курса. */
export interface TestResultRow {
  progress_id: number
  student: {
    id: number
    email: string
    first_name: string | null
    last_name: string | null
  }
  status: ProgressStatus
  count_current_answer: number | null
  questions_total: number
  attempt_date: number | null
}
