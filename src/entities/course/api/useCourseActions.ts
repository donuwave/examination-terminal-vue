import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { http } from '@/shared/api'

const useRefreshCourses = () => {
  const queryClient = useQueryClient()
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ['courses'] }),
      queryClient.invalidateQueries({ queryKey: ['test-progress'] }),
    ])
}

/** Студент выходит из курса. */
export const useLeaveCourse = () => {
  const refresh = useRefreshCourses()
  return useMutation({
    mutationFn: async (courseId: number) => {
      await http.post(`/api/v1/course/${courseId}/leave`)
    },
    onSuccess: refresh,
  })
}

/** Преподаватель удаляет свой курс. */
export const useDeleteCourse = () => {
  const refresh = useRefreshCourses()
  return useMutation({
    mutationFn: async (courseId: number) => {
      await http.delete(`/api/v1/course/${courseId}`)
    },
    onSuccess: refresh,
  })
}

/** Преподаватель создаёт курс. Возвращает id нового курса. */
export const useCreateCourse = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (values: { name: string; description: string; categoryId: number }) =>
      (
        await http.post<{ id: number }>(
          '/api/v1/course/',
          new URLSearchParams({
            name: values.name,
            description: values.description,
            category_id: String(values.categoryId),
          }),
        )
      ).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['courses'] }),
  })
}
