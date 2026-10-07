import type { Role } from '@/entities/role/@x/profile'

/** 1 — женский, 2 — мужской. */
export type Gender = 1 | 2

export interface Profile {
  id: number
  email: string
  first_name: string | null
  last_name: string | null
  age: number | null
  gender: Gender | null
  role: Role
}

export interface ProfileUpdate {
  first_name: string | null
  last_name: string | null
  age: number | null
  gender: Gender | null
}
