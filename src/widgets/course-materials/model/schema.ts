import { object, string, type InferType } from 'yup'

export const MAX_FILES = 5
export const MAX_FILE_SIZE = 10 * 1024 * 1024

export const materialSchema = object({
  title: string().trim().required('Введите заголовок').max(200, 'Не длиннее 200 символов'),
  description: string().trim().max(5000, 'Не длиннее 5000 символов').default(''),
})

export type MaterialValues = InferType<typeof materialSchema>
