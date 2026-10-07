import { useMutation } from '@tanstack/vue-query'
import { http } from '@/shared/api'
import type { Tokens } from '../model/types'

export const useLogin = () =>
  useMutation({
    mutationFn: async (values: { email: string; password: string }) =>
      (await http.post<Tokens>('/api/v1/auth/login', new URLSearchParams(values))).data,
  })
