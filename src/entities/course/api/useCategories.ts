import { useQuery } from '@tanstack/vue-query'
import { http } from '@/shared/api'
import type { CourseCategory } from '../model/types'

export const useCategories = () =>
  useQuery({
    queryKey: ['course-categories'],
    queryFn: async () => (await http.get<CourseCategory[]>('/api/v1/course/categories')).data,
    staleTime: 10 * 60 * 1000,
  })
