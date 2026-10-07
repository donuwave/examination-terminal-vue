import { useMutation } from '@tanstack/vue-query'
import { http } from '@/shared/api'
import type { Tokens } from '../model/types'

export const useRegistration = () =>
  useMutation({
    mutationFn: async (values: { email: string; password: string; roleId: number }) =>
      (
        await http.post<Tokens>(
          '/api/v1/auth/registration',
          new URLSearchParams({
            email: values.email,
            password: values.password,
            role_id: String(values.roleId),
          }),
        )
      ).data,
  })
