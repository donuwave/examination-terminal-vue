import axios from 'axios'
import { errorMessage, http } from '@/shared/api'
import { toastError } from '@/shared/ui/toast'
import { useSession } from '@/entities/session'

const isAuthUrl = (url?: string) => !!url?.startsWith('/api/v1/auth/')

export const setupHttp = () => {
  http.interceptors.request.use((config) => {
    const session = useSession()
    if (!isAuthUrl(config.url) && session.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`
    }
    return config
  })

  http.interceptors.response.use(
    (response) => response,
    async (error) => {
      const session = useSession()
      const original = error.config as (typeof error.config & { _retry?: boolean }) | undefined

      if (error.response?.status === 401 && original && !isAuthUrl(original.url)) {
        if (session.refreshToken && !original._retry) {
          original._retry = true
          try {
            const { data } = await axios.post('/api/v1/auth/refresh', null, {
              headers: { Authorization: `Bearer ${session.refreshToken}` },
            })
            session.set(data)
            original.headers.Authorization = `Bearer ${data.access_token}`
            return http(original)
          } catch {
            /* fall through */
          }
        }
        session.clear()
        window.location.assign('/auth')
        return Promise.reject(error)
      }
      toastError(errorMessage(error))
      return Promise.reject(error)
    },
  )
}
