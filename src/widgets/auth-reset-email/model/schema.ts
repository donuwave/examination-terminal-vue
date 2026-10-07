import { object, type InferType } from 'yup'
import { emailRule } from '@/shared/lib/validation'

export const resetEmailSchema = object({ email: emailRule() })

export type ResetEmailValues = InferType<typeof resetEmailSchema>
