import { reactive } from 'vue'

export type ToastKind = 'error' | 'success'

export interface Toast {
  id: number
  kind: ToastKind
  message: string
}

const MAX_TOASTS = 4
const LIFETIME_MS = 5000

export const toasts = reactive<Toast[]>([])

let nextId = 0
const timers = new Map<number, ReturnType<typeof setTimeout>>()

export const dismissToast = (id: number) => {
  clearTimeout(timers.get(id))
  timers.delete(id)
  const index = toasts.findIndex((toast) => toast.id === id)
  if (index !== -1) toasts.splice(index, 1)
}

const show = (kind: ToastKind, message: string) => {
  const duplicate = toasts.find((toast) => toast.kind === kind && toast.message === message)
  if (duplicate) dismissToast(duplicate.id)

  const id = nextId++
  toasts.push({ id, kind, message })
  if (toasts.length > MAX_TOASTS) dismissToast(toasts[0].id)
  timers.set(
    id,
    setTimeout(() => dismissToast(id), LIFETIME_MS),
  )
}

export const toastError = (message: string) => show('error', message)
export const toastSuccess = (message: string) => show('success', message)
