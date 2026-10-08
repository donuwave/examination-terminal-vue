<script setup lang="ts">
import { ref } from 'vue'
import { downloadMaterialFile, type Material, type MaterialFile } from '@/entities/material'
import { formatDate, formatFileSize } from '@/shared/lib'
import { BaseDialog } from '@/shared/ui/dialog'
import { Icon } from '@/shared/ui/icon'
import { ScrollArea } from '@/shared/ui/scroll-area'

const props = defineProps<{ material: Material | null; canDelete: boolean }>()
const emit = defineEmits<{ delete: [] }>()
const open = defineModel<boolean>({ default: false })

const downloading = ref(new Set<number>())

const download = async (file: MaterialFile) => {
  if (!props.material) return
  downloading.value = new Set(downloading.value).add(file.id)
  try {
    await downloadMaterialFile(props.material.course_id, file)
  } finally {
    const next = new Set(downloading.value)
    next.delete(file.id)
    downloading.value = next
  }
}
</script>

<template>
  <BaseDialog
    v-model="open"
    :title="material?.title ?? 'Материал'"
    max-width="max-w-2xl"
    padding="p-0"
    panel-class="flex max-h-[calc(100vh-4rem)] flex-col overflow-hidden"
  >
    <template v-if="material">
      <header
        class="flex shrink-0 items-start justify-between gap-4 border-b border-line px-6 py-5"
      >
        <div class="min-w-0">
          <h2 class="break-words text-2xl font-extrabold leading-tight">{{ material.title }}</h2>
          <p class="mt-1 text-sm text-ink-soft">{{ formatDate(material.created_at) }}</p>
        </div>
        <button
          type="button"
          class="shrink-0 rounded-lg p-2 text-ink-soft transition hover:bg-canvas hover:text-ink"
          aria-label="Закрыть"
          @click="open = false"
        >
          <Icon name="x" size="20" />
        </button>
      </header>

      <ScrollArea class="min-h-0 flex-1">
        <div class="px-6 py-5 pr-8">
          <p
            v-if="material.description"
            class="whitespace-pre-line break-words leading-relaxed text-ink/85"
          >
            {{ material.description }}
          </p>
          <p v-else class="text-ink-soft">У материала нет описания.</p>

          <template v-if="material.files.length">
            <h3 class="mt-7 text-sm font-bold">Файлы ({{ material.files.length }})</h3>
            <ul class="mt-3 space-y-2">
              <li
                v-for="file in material.files"
                :key="file.id"
                class="flex items-center gap-3 rounded-2xl border border-line px-4 py-3"
              >
                <span
                  class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-canvas text-ink-soft"
                >
                  <Icon name="file" size="20" />
                </span>
                <div class="min-w-0 flex-1">
                  <p class="truncate font-semibold">{{ file.filename }}</p>
                  <p class="text-sm text-ink-soft">{{ formatFileSize(file.size) }}</p>
                </div>
                <button
                  type="button"
                  class="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-brand-soft px-3.5 py-2 text-sm font-semibold text-brand transition duration-200 hover:-translate-y-0.5 active:scale-[.98] disabled:opacity-60"
                  :disabled="downloading.has(file.id)"
                  :aria-label="`Скачать ${file.filename}`"
                  @click="download(file)"
                >
                  <span
                    v-if="downloading.has(file.id)"
                    class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                  />
                  <Icon v-else name="download" size="18" />
                  Скачать
                </button>
              </li>
            </ul>
          </template>
        </div>
      </ScrollArea>

      <footer
        v-if="canDelete"
        class="flex shrink-0 items-center justify-between gap-3 border-t border-line px-6 py-4"
      >
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          @click="emit('delete')"
        >
          <Icon name="trash" size="18" />
          Удалить материал
        </button>
        <button
          type="button"
          class="rounded-xl bg-canvas px-4 py-2 text-sm font-semibold transition hover:bg-line"
          @click="open = false"
        >
          Закрыть
        </button>
      </footer>
    </template>
  </BaseDialog>
</template>
