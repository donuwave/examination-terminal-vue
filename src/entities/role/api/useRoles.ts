import { useQuery } from '@tanstack/vue-query'
import { http } from '@/shared/api'
import type { Role } from '../model/types'

export const useRoles = () =>
  useQuery({
    queryKey: ['roles'],
    queryFn: async () => (await http.get<Role[]>('/api/v1/role/')).data,
  })
