<script setup lang="ts">
import { ref } from 'vue'
import {
  downloadMaterialFile,
  useDeleteMaterial,
  useMaterials,
  type Material,
  type MaterialFile,
} from '@/entities/material'
import { formatDate, formatFileSize } from '@/shared/lib'
import { BaseButton } from '@/shared/ui/button'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'
import { Icon } from '@/shared/ui/icon'
import MaterialFormDialog from './MaterialFormDialog.vue'

const props = defineProps<{ courseId: number; viewer: 'student' | 'teacher' }>()

const LONG_TEXT = 220

const { data: materials, isPending } = useMaterials(() => props.courseId)
const { mutate: remove, isPending: isDeleting } = useDeleteMaterial(() => props.courseId)

const formOpen = ref(false)
const toDelete = ref<Material | null>(null)
const deleteOpen = ref(false)
const expanded = ref(new Set<number>())
const downloading = ref(new Set<number>())

const askDelete = (material: Material) => {
  toDelete.value = material
  deleteOpen.value = true
}

const confirmDelete = () => {
  if (!toDelete.value) return
  remove(toDelete.value.id, { onSuccess: () => (deleteOpen.value = false) })
}

const toggle = (id: number) => {
  const next = new Set(expanded.value)
  if (!next.delete(id)) next.add(id)
  expanded.value = next
}

const download = async (file: MaterialFile) => {
  downloading.value = new Set(downloading.value).add(file.id)
  try {
    await downloadMaterialFile(props.courseId, file)
  } finally {
    const next = new Set(downloading.value)
    next.delete(file.id)
    downloading.value = next
  }
}
</script>

<template>
  <section>
    <div class="flex items-center justify-between gap-3">
      <h2 class="text-2xl font-extrabold tracking-tight">Материалы</h2>
      <button
        v-if="viewer === 'teacher'"
        type="button"
        class="inline-flex items-center gap-1.5 rounded-xl bg-brand-soft px-3.5 py-2 text-sm font-semibold text-brand transition duration-200 hover:-translate-y-0.5 active:scale-[.98]"
        @click="formOpen = true"
      >
        <Icon name="plus" size="18" />
        Добавить
      </button>
    </div>

    <div v-if="isPending" class="mt-5 space-y-3">
      <div v-for="n in 2" :key="n" class="h-[112px] animate-pulse rounded-card bg-line/60" />
    </div>

    <ul v-else-if="materials?.length" class="mt-5 space-y-3">
      <li v-for="material in materials" :key="material.id" class="card p-5">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h3 class="text-lg font-bold">{{ material.title }}</h3>
            <p class="mt-0.5 text-xs text-ink-soft">{{ formatDate(material.created_at) }}</p>
          </div>
          <button
            v-if="viewer === 'teacher'"
            type="button"
            class="shrink-0 rounded-lg p-2 text-ink-soft transition hover:bg-red-50 hover:text-red-600"
            :aria-label="`Удалить материал «${material.title}»`"
            @click="askDelete(material)"
          >
            <Icon name="trash" size="18" />
          </button>
        </div>

        <template v-if="material.description">
          <p
            class="mt-3 whitespace-pre-line leading-relaxed text-ink/80"
            :class="
              material.description.length > LONG_TEXT && !expanded.has(material.id)
                ? 'line-clamp-3'
                : ''
            "
          >
            {{ material.description }}
          </p>
          <button
            v-if="material.description.length > LONG_TEXT"
            type="button"
            class="mt-1 text-sm font-semibold text-brand hover:underline"
            @click="toggle(material.id)"
          >
            {{ expanded.has(material.id) ? 'Свернуть' : 'Читать полностью' }}
          </button>
        </template>

        <ul v-if="material.files.length" class="mt-4 flex flex-wrap gap-2">
          <li v-for="file in material.files" :key="file.id">
            <button
              type="button"
              class="inline-flex max-w-full items-center gap-2 rounded-xl border border-line bg-canvas/60 px-3 py-2 text-sm transition duration-200 hover:border-brand hover:bg-brand-soft/40 disabled:opacity-60"
              :disabled="downloading.has(file.id)"
              :title="`Скачать ${file.filename}`"
              @click="download(file)"
            >
              <Icon name="file" size="18" class="shrink-0 text-ink-soft" />
              <span class="truncate font-medium">{{ file.filename }}</span>
              <span class="shrink-0 text-ink-soft">{{ formatFileSize(file.size) }}</span>
              <Icon name="download" size="16" class="shrink-0 text-brand" />
            </button>
          </li>
        </ul>
      </li>
    </ul>

    <div v-else class="card mt-5 flex flex-col items-center px-6 py-8 text-center">
      <span class="grid h-14 w-14 place-items-center rounded-2xl bg-canvas text-ink-soft">
        <Icon name="file" size="26" />
      </span>
      <p class="mt-3 font-bold">Материалов пока нет</p>
      <p class="mt-1 max-w-sm text-sm text-ink-soft">
        {{
          viewer === 'teacher'
            ? 'Добавьте теорию или файлы, и студенты увидят их здесь.'
            : 'Преподаватель ещё ничего не добавил к этому курсу.'
        }}
      </p>
      <BaseButton v-if="viewer === 'teacher'" class="mt-5 !w-auto" @click="formOpen = true">
        Добавить материал
      </BaseButton>
    </div>

    <MaterialFormDialog v-if="viewer === 'teacher'" v-model="formOpen" :course-id="courseId" />

    <ConfirmDialog
      v-model="deleteOpen"
      title="Удалить материал?"
      :text="`«${toDelete?.title ?? ''}» и его файлы будут удалены. Это нельзя отменить.`"
      confirm-label="Удалить"
      :loading="isDeleting"
      @confirm="confirmDelete"
    />
  </section>
</template>
