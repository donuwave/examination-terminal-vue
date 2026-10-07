import { mixed, object, string, type InferType } from 'yup'

const MIN_AGE = 10
const MAX_AGE = 120

export const profileSchema = object({
  first_name: string().trim().max(50, 'Не длиннее 50 символов').default(''),
  last_name: string().trim().max(50, 'Не длиннее 50 символов').default(''),
  // Возраст храним строкой, чтобы пустое поле не превращалось в 0 или NaN.
  age: string()
    .trim()
    .default('')
    .test('age', `Возраст от ${MIN_AGE} до ${MAX_AGE}`, (value) => {
      if (!value) return true
      const age = Number(value)
      return Number.isInteger(age) && age >= MIN_AGE && age <= MAX_AGE
    }),
  gender: mixed<1 | 2>().nullable().default(null),
})

export type ProfileFormValues = InferType<typeof profileSchema>
