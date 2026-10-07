import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { http } from '@/shared/api'
import type { Material, MaterialFile } from '../model/types'

const base = (courseId: number) => `/api/v1/course/${courseId}/materials`

export const useMaterials = (courseId: MaybeRefOrGetter<number>) =>
  useQuery({
    queryKey: computed(() => ['materials', toValue(courseId)]),
    queryFn: async () => (await http.get<Material[]>(base(toValue(courseId)))).data,
  })

export const useCreateMaterial = (courseId: MaybeRefOrGetter<number>) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (values: { title: string; description: string; files: File[] }) => {
      const form = new FormData()
      form.append('title', values.title)
      form.append('description', values.description)
      values.files.forEach((file) => form.append('files', file))
      return (
        await http.post<Material>(base(toValue(courseId)), form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      ).data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['materials', toValue(courseId)] }),
  })
}

export const useDeleteMaterial = (courseId: MaybeRefOrGetter<number>) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (materialId: number) => {
      await http.delete(`${base(toValue(courseId))}/${materialId}`)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['materials', toValue(courseId)] }),
  })
}

/** Файл отдаётся только с токеном, поэтому качаем через запрос, а не обычной ссылкой. */
export const downloadMaterialFile = async (courseId: number, file: MaterialFile) => {
  const { data } = await http.get<Blob>(`${base(courseId)}/files/${file.id}`, {
    responseType: 'blob',
  })
  const url = URL.createObjectURL(data)
  const link = document.createElement('a')
  link.href = url
  link.download = file.filename
  document.body.append(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
