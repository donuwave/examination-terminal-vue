import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { http } from '@/shared/api'
import type { Course } from '../model/types'

export interface CourseFilters {
  search?: string
  categoryId?: number | null
}

export const useCourses = (filters?: MaybeRefOrGetter<CourseFilters>) => {
  const params = computed(() => {
    const { search, categoryId } = toValue(filters) ?? {}
    return {
      ...(search?.trim() ? { search: search.trim() } : {}),
      ...(categoryId ? { category_id: categoryId } : {}),
    }
  })

  return useQuery({
    queryKey: computed(() => ['courses', params.value]),
    queryFn: async () =>
      (await http.get<Course[]>('/api/v1/course/', { params: params.value })).data,
    placeholderData: (previous) => previous,
  })
}
