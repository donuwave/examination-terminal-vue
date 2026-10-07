import { type MaybeRefOrGetter, toValue } from 'vue'
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

const useRefreshCourse = (courseId: MaybeRefOrGetter<number>) => {
  const queryClient = useQueryClient()
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ['course', toValue(courseId)] }),
      queryClient.invalidateQueries({ queryKey: ['courses'] }),
      queryClient.invalidateQueries({ queryKey: ['catalog'] }),
    ])
}

/** Преподаватель правит название, описание и тип своего курса. */
export const useUpdateCourse = (courseId: MaybeRefOrGetter<number>) =>
  useMutation({
    mutationFn: async (values: { name: string; description: string; categoryId: number }) => {
      await http.patch(
        `/api/v1/course/${toValue(courseId)}`,
        { name: values.name, description: values.description, category_id: values.categoryId },
        { headers: { 'Content-Type': 'application/json' } },
      )
    },
    onSuccess: useRefreshCourse(courseId),
  })

export const useRemoveStudent = (courseId: MaybeRefOrGetter<number>) => {
  const refresh = useRefreshCourse(courseId)
  return useMutation({
    mutationFn: async (studentId: number) => {
      await http.post(`/api/v1/course/${toValue(courseId)}/delete_student`, null, {
        params: { student_id: studentId },
      })
    },
    onSuccess: () => refresh(),
  })
}
