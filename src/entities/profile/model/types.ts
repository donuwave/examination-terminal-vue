import type { Role } from '@/entities/role/@x/profile'

export interface Profile {
  id: number
  email: string
  first_name: string | null
  last_name: string | null
  role: Role
}
