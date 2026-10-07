import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { http } from '@/shared/api'
import type { TestResultRow } from '../model/types'

/** Результаты теста по студентам курса. Доступны только преподавателю курса. */
export const useTestResults = (
  courseId: MaybeRefOrGetter<number>,
  testId: MaybeRefOrGetter<number>,
) =>
  useQuery({
    queryKey: computed(() => ['test-results', toValue(courseId), toValue(testId)]),
    queryFn: async () =>
      (
        await http.get<TestResultRow[]>('/api/v1/test-progress/results', {
          params: { course_id: toValue(courseId), test_id: toValue(testId) },
        })
      ).data,
    staleTime: 0,
  })
