import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { http } from '@/shared/api'
import type { AnswerPayload, TestProgress } from '../model/types'

const base = (id: number) => `/api/v1/test-progress/${id}`
const json = { headers: { 'Content-Type': 'application/json' } }

export const useProgress = (id: MaybeRefOrGetter<number>) =>
  useQuery({
    queryKey: computed(() => ['progress', toValue(id)]),
    queryFn: async () => (await http.get<TestProgress>(base(toValue(id)))).data,
    // Состояние попытки зависит от времени, поэтому не берём его из старого кэша.
    staleTime: 0,
    refetchOnWindowFocus: false,
  })

const useApply = (id: MaybeRefOrGetter<number>) => {
  const queryClient = useQueryClient()
  return (progress: TestProgress) => {
    queryClient.setQueryData(['progress', toValue(id)], progress)
    return queryClient.invalidateQueries({ queryKey: ['test-progress'] })
  }
}

export const useStartTest = (id: MaybeRefOrGetter<number>) =>
  useMutation({
    mutationFn: async () => (await http.post<TestProgress>(`${base(toValue(id))}/start-test`)).data,
    onSuccess: useApply(id),
  })

/** Автосохранение: не трогает кэш, чтобы экран не перерисовывался на каждый ответ. */
export const useSaveAnswers = (id: MaybeRefOrGetter<number>) =>
  useMutation({
    mutationFn: async (answers: AnswerPayload[]) =>
      (await http.put<TestProgress>(`${base(toValue(id))}/answers`, answers, json)).data,
  })

export const useCompleteTest = (id: MaybeRefOrGetter<number>) =>
  useMutation({
    mutationFn: async (answers: AnswerPayload[]) =>
      (await http.post<TestProgress>(`${base(toValue(id))}/completion-test`, answers, json)).data,
    onSuccess: useApply(id),
  })
