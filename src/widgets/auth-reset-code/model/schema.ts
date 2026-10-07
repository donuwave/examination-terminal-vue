import { object, string, type InferType } from 'yup'

export const CODE_LENGTH = 6

export const resetCodeSchema = object({
  code: string()
    .required('Введите код из письма')
    .matches(new RegExp(`^\\d{${CODE_LENGTH}}$`), `Код состоит из ${CODE_LENGTH} цифр`),
})

export type ResetCodeValues = InferType<typeof resetCodeSchema>
