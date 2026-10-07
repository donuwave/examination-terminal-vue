import { useQuery } from '@tanstack/vue-query'
import { http } from '@/shared/api'
import type { Profile } from '../model/types'

export const useProfile = () =>
  useQuery({
    queryKey: ['profile'],
    queryFn: async () => (await http.get<Profile>('/api/v1/profile/me')).data,
  })
