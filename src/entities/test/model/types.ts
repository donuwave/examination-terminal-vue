export interface QuestionDraft {
  text_question: string
  options: string[]
  correct_answer: string
}

export interface MyTest {
  id: number
  name: string
  time_limit: number
  questions: { id: number }[]
}
