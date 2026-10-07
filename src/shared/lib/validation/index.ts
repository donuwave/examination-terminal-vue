import { string } from 'yup'

export const emailRule = () => string().trim().required('Введите почту').email('Некорректная почта')

export const passwordRule = () =>
  string().required('Придумайте пароль').min(6, 'Минимум 6 символов')
