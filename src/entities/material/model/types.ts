export interface MaterialFile {
  id: number
  filename: string
  content_type: string
  size: number
}

export interface Material {
  id: number
  course_id: number
  title: string
  description: string
  created_at: string
  files: MaterialFile[]
}
