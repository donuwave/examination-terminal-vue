export type {
  CatalogCourse,
  Course,
  CourseCategory,
  CourseDetails,
  CourseStudent,
  CourseTest,
} from './model/types'
export { useCourses, type CourseFilters } from './api/useCourses'
export { useCategories } from './api/useCategories'
export { useCatalog, useEnrollCourse } from './api/useCatalog'
export { useCourse } from './api/useCourse'
export {
  useAddStudents,
  useCreateCourse,
  useDeleteCourse,
  useLeaveCourse,
  useRemoveStudent,
  useStudentCandidates,
  useUpdateCourse,
} from './api/useCourseActions'
export { personInitials, personName } from './lib/person-name'
export { courseColor } from './lib/course-color'
export { default as CourseCard } from './ui/CourseCard.vue'
export { courseSchema, type CourseValues } from './model/schema'
