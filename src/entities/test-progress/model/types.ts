/** 1 — готов к прохождению, 2 — начат, 3 — завершён, 4 — просрочен. */
export type ProgressStatus = 1 | 2 | 3 | 4

export interface TestProgress {
  id: number
  status: ProgressStatus
  deadline_date: number
  attempt_date: number | null
  count_current_answer: number | null
  timelimit: number
  remaining_time: number | null
  test: { id: number; name: string }
  result_test: { id: number }[]
}
