import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { http } from '@/shared/api'
import type { CourseStudent } from '../model/types'

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

/** Студенты, которых ещё можно записать на курс. */
export const useStudentCandidates = (
  courseId: MaybeRefOrGetter<number>,
  search: MaybeRefOrGetter<string>,
  enabled: MaybeRefOrGetter<boolean>,
) =>
  useQuery({
    queryKey: computed(() => ['candidates', toValue(courseId), toValue(search).trim()]),
    queryFn: async () =>
      (
        await http.get<CourseStudent[]>(`/api/v1/course/${toValue(courseId)}/candidates`, {
          params: toValue(search).trim() ? { search: toValue(search).trim() } : {},
        })
      ).data,
    enabled: computed(() => toValue(enabled)),
    placeholderData: (previous) => previous,
  })

export const useAddStudents = (courseId: MaybeRefOrGetter<number>) => {
  const queryClient = useQueryClient()
  const refresh = useRefreshCourse(courseId)
  return useMutation({
    mutationFn: async (studentIds: number[]) => {
      await http.post(`/api/v1/course/${toValue(courseId)}/add_student`, studentIds, {
        headers: { 'Content-Type': 'application/json' },
      })
    },
    onSuccess: () =>
      Promise.all([refresh(), queryClient.invalidateQueries({ queryKey: ['candidates'] })]),
  })
}

export const useRemoveStudent = (courseId: MaybeRefOrGetter<number>) => {
  const queryClient = useQueryClient()
  const refresh = useRefreshCourse(courseId)
  return useMutation({
    mutationFn: async (studentId: number) => {
      await http.post(`/api/v1/course/${toValue(courseId)}/delete_student`, null, {
        params: { student_id: studentId },
      })
    },
    onSuccess: () =>
      Promise.all([refresh(), queryClient.invalidateQueries({ queryKey: ['candidates'] })]),
  })
}
