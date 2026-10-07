import { number, object, ref, string, type InferType } from 'yup'
import { emailRule, passwordRule } from '@/shared/lib/validation'

export const registrationSchema = object({
  email: emailRule(),
  password: passwordRule(),
  passwordRepeat: string()
    .required('Повторите пароль')
    .oneOf([ref('password')], 'Пароли не совпадают'),
  roleId: number().required('Выберите роль'),
})

export type RegistrationValues = InferType<typeof registrationSchema>
