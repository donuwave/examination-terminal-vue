import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { http } from '@/shared/api'
import type { CourseDetails } from '../model/types'

export const useCourse = (id: MaybeRefOrGetter<number>) =>
  useQuery({
    queryKey: computed(() => ['course', toValue(id)]),
    queryFn: async () => (await http.get<CourseDetails>(`/api/v1/course/${toValue(id)}`)).data,
  })
