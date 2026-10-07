import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Tokens } from './types'

const STORAGE_KEY = 'session'

const load = (): { accessToken: string; refreshToken: string | null } => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore */
  }
  return { accessToken: '', refreshToken: null }
}

export const useSession = defineStore('session', () => {
  const initial = load()
  const accessToken = ref(initial.accessToken)
  const refreshToken = ref(initial.refreshToken)

  const isAuthed = computed(() => !!accessToken.value)

  const set = (tokens: Pick<Tokens, 'access_token'> & Partial<Tokens>) => {
    accessToken.value = tokens.access_token
    refreshToken.value = tokens.refresh_token ?? refreshToken.value
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ accessToken: accessToken.value, refreshToken: refreshToken.value }),
    )
  }

  const clear = () => {
    accessToken.value = ''
    refreshToken.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  return { accessToken, refreshToken, isAuthed, set, clear }
})
