import { toValue, type MaybeRefOrGetter } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { http } from '@/shared/api'
import type { MyTest, QuestionDraft } from '../model/types'

const json = { headers: { 'Content-Type': 'application/json' } }

/** Тесты, которые создал текущий преподаватель. */
export const useMyTests = (enabled: MaybeRefOrGetter<boolean> = true) =>
  useQuery({
    queryKey: ['my-tests'],
    queryFn: async () => (await http.get<MyTest[]>('/api/v1/tests/')).data,
    enabled: () => toValue(enabled),
  })

const useRefreshCourse = (courseId: MaybeRefOrGetter<number>) => {
  const queryClient = useQueryClient()
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ['course', toValue(courseId)] }),
      queryClient.invalidateQueries({ queryKey: ['courses'] }),
      queryClient.invalidateQueries({ queryKey: ['my-tests'] }),
    ])
}

/** Создаёт тест с вопросами и сразу добавляет его в курс. */
export const useCreateTestInCourse = (courseId: MaybeRefOrGetter<number>) =>
  useMutation({
    mutationFn: async (values: { name: string; minutes: number; questions: QuestionDraft[] }) => {
      const { data: test } = await http.post<{ id: number }>(
        '/api/v1/tests/',
        new URLSearchParams({ name_test: values.name, time_limit: String(values.minutes * 60) }),
      )
      await http.post(`/api/v1/tests/${test.id}/add_questions`, values.questions, json)
      await http.post(`/api/v1/course/${toValue(courseId)}/add_test`, [test.id], json)
      return test
    },
    onSuccess: useRefreshCourse(courseId),
  })

/** Добавляет в курс уже существующие тесты. */
export const useAttachTests = (courseId: MaybeRefOrGetter<number>) =>
  useMutation({
    mutationFn: async (testIds: number[]) => {
      await http.post(`/api/v1/course/${toValue(courseId)}/add_test`, testIds, json)
    },
    onSuccess: useRefreshCourse(courseId),
  })

/** Открывает студентам курса доступ к тесту до указанного момента. */
export const useOpenAccess = (courseId: MaybeRefOrGetter<number>) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (values: { testId: number; deadline: Date }) => {
      await http.post(`/api/v1/tests/${values.testId}/access_activation`, null, {
        params: {
          deadline_date: Math.floor(values.deadline.getTime() / 1000),
          course_id: toValue(courseId),
        },
      })
    },
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['course', toValue(courseId)] }),
        queryClient.invalidateQueries({ queryKey: ['test-progress'] }),
      ]),
  })
}
