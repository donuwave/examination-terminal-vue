import { object, ref, string, type InferType } from 'yup'
import { passwordRule } from '@/shared/lib/validation'

export const resetNewSchema = object({
  password: passwordRule(),
  passwordRepeat: string()
    .required('Повторите пароль')
    .oneOf([ref('password')], 'Пароли не совпадают'),
})

export type ResetNewValues = InferType<typeof resetNewSchema>
