import axios from 'axios'

export const http = axios.create({
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
})

export const errorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail)) return 'Проверьте правильность заполнения полей'
    if (!error.response) return 'Нет связи с сервером'
  }

  return 'Что-то пошло не так'
}
