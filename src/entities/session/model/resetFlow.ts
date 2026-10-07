import { defineStore } from 'pinia'
import { ref } from 'vue'

/** Состояние многошагового сброса пароля: почта → код → новый пароль. */
export const useResetFlow = defineStore('reset-flow', () => {
  const email = ref('')
  const verified = ref(false)

  const reset = () => {
    email.value = ''
    verified.value = false
  }

  return { email, verified, reset }
})
