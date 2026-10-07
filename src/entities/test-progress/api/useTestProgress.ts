import { useQuery } from '@tanstack/vue-query'
import { http } from '@/shared/api'
import type { TestProgress } from '../model/types'

/** Все попытки текущего пользователя. filter_date=0 отдаёт и те, что уже просрочены. */
export const useTestProgress = () =>
  useQuery({
    queryKey: ['test-progress'],
    queryFn: async () =>
      (await http.get<TestProgress[]>('/api/v1/test-progress/', { params: { filter_date: 0 } }))
        .data,
  })
