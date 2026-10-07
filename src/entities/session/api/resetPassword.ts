import { useMutation } from '@tanstack/vue-query'

// TODO: заменить заглушки настоящими запросами, когда на бэкенде появится сброс пароля.
// Пока ответы имитируются, чтобы фронт можно было доделать заранее.
const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms))

/** Тестовый код, который принимает заглушка. */
export const STUB_CODE = '123456'

export const useRequestCode = () =>
  useMutation({
    mutationFn: async (_values: { email: string }) => {
      await delay()
    },
  })

export const useVerifyCode = () =>
  useMutation({
    mutationFn: async (values: { email: string; code: string }) => {
      await delay()
      if (values.code !== STUB_CODE) throw new Error('invalid-code')
    },
  })

export const useSetNewPassword = () =>
  useMutation({
    mutationFn: async (_values: { email: string; password: string }) => {
      await delay()
    },
  })
