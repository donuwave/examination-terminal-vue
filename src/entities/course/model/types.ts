export interface CourseTeacher {
  email: string
  first_name: string | null
  last_name: string | null
}

export interface CourseCategory {
  id: number
  name: string
}

export interface Course {
  id: number
  name: string
  description: string
  category: CourseCategory | null
  teacher: CourseTeacher
  students: { id: number }[]
  tests: { id: number; name: string; time_limit: number }[]
}

export interface CourseTest {
  id: number
  name: string
  time_limit: number
  /** Открыл ли преподаватель доступ к тесту. */
  access_test: boolean
}

export interface CourseStudent {
  id: number
  email: string
  first_name: string | null
  last_name: string | null
}

export interface CourseDetails {
  id: number
  name: string
  description: string
  category: CourseCategory | null
  teacher: CourseTeacher
  students: CourseStudent[]
  tests: CourseTest[]
}

/** Курс в общем каталоге: без списка студентов, только счётчики. */
export interface CatalogCourse {
  id: number
  name: string
  description: string
  category: CourseCategory | null
  teacher: CourseTeacher & { id: number }
  students_count: number
  tests_count: number
  is_member: boolean
}
