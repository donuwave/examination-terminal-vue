import { number, object, string, type InferType } from 'yup'

export const courseSchema = object({
  name: string().trim().required('Введите название').max(100, 'Не длиннее 100 символов'),
  description: string().trim().required('Добавьте описание').max(1000, 'Не длиннее 1000 символов'),
  categoryId: number().required('Выберите тип курса'),
})

export type CourseValues = InferType<typeof courseSchema>
