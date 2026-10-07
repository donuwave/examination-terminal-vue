import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { http } from '@/shared/api'
import type { CatalogCourse } from '../model/types'
import type { CourseFilters } from './useCourses'

/** Все курсы платформы, а не только те, где пользователь участвует. */
export const useCatalog = (
  filters?: MaybeRefOrGetter<CourseFilters>,
  enabled: MaybeRefOrGetter<boolean> = true,
) => {
  const params = computed(() => {
    const { search, categoryId } = toValue(filters) ?? {}
    return {
      ...(search?.trim() ? { search: search.trim() } : {}),
      ...(categoryId ? { category_id: categoryId } : {}),
    }
  })

  return useQuery({
    queryKey: computed(() => ['catalog', params.value]),
    queryFn: async () =>
      (await http.get<CatalogCourse[]>('/api/v1/course/catalog', { params: params.value })).data,
    enabled: computed(() => toValue(enabled)),
    placeholderData: (previous) => previous,
  })
}

/** Студент записывается на курс сам. */
export const useEnrollCourse = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (courseId: number) =>
      (await http.post<{ id: number }>(`/api/v1/course/${courseId}/enroll`)).data,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['courses'] }),
        queryClient.invalidateQueries({ queryKey: ['catalog'] }),
        queryClient.invalidateQueries({ queryKey: ['test-progress'] }),
      ]),
  })
}
