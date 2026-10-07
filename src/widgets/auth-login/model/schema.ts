import { object, string, type InferType } from 'yup'
import { emailRule } from '@/shared/lib/validation'

export const loginSchema = object({
  email: emailRule(),
  password: string().required('Введите пароль'),
})

export type LoginValues = InferType<typeof loginSchema>
