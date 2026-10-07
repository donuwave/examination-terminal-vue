import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { http } from '@/shared/api'
import type { Profile, ProfileUpdate } from '../model/types'

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (values: ProfileUpdate) =>
      (
        await http.patch<Profile>('/api/v1/profile/', values, {
          headers: { 'Content-Type': 'application/json' },
        })
      ).data,
    onSuccess: (profile) => queryClient.setQueryData(['profile'], profile),
  })
}
