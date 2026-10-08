<script setup lang="ts">
import { ref } from 'vue'
import { useDeleteMaterial, useMaterials, type Material } from '@/entities/material'
import { formatDate, pluralize } from '@/shared/lib'
import { BaseButton } from '@/shared/ui/button'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'
import { Icon } from '@/shared/ui/icon'
import MaterialFormDialog from './MaterialFormDialog.vue'
import MaterialViewDialog from './MaterialViewDialog.vue'

const props = defineProps<{ courseId: number; viewer: 'student' | 'teacher' }>()

const { data: materials, isPending } = useMaterials(() => props.courseId)
const { mutate: remove, isPending: isDeleting } = useDeleteMaterial(() => props.courseId)

const formOpen = ref(false)
const viewed = ref<Material | null>(null)
const viewOpen = ref(false)
const deleteOpen = ref(false)

const view = (material: Material) => {
  viewed.value = material
  viewOpen.value = true
}

const confirmDelete = () => {
  if (!viewed.value) return
  remove(viewed.value.id, {
    onSuccess: () => {
      deleteOpen.value = false
      viewOpen.value = false
    },
  })
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
      <li v-for="material in materials" :key="material.id">
        <button
          type="button"
          class="card block w-full p-5 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_rgba(31,36,48,.14)] focus-visible:outline-2 focus-visible:outline-brand"
          @click="view(material)"
        >
          <h3 class="text-lg font-bold">{{ material.title }}</h3>
          <p class="mt-0.5 text-xs text-ink-soft">{{ formatDate(material.created_at) }}</p>
          <p
            v-if="material.description"
            class="mt-3 line-clamp-3 whitespace-pre-line break-words leading-relaxed text-ink/80"
          >
            {{ material.description }}
          </p>
          <p
            v-if="material.files.length"
            class="mt-4 inline-flex items-center gap-1.5 rounded-full bg-canvas px-3 py-1 text-xs font-semibold text-ink-soft"
          >
            <Icon name="file" size="14" />
            {{ material.files.length }}
            {{ pluralize(material.files.length, ['файл', 'файла', 'файлов']) }}
          </p>
        </button>
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

    <MaterialViewDialog
      v-model="viewOpen"
      :material="viewed"
      :can-delete="viewer === 'teacher'"
      @delete="deleteOpen = true"
    />

    <ConfirmDialog
      v-model="deleteOpen"
      title="Удалить материал?"
      :text="`«${viewed?.title ?? ''}» и его файлы будут удалены. Это нельзя отменить.`"
      confirm-label="Удалить"
      :loading="isDeleting"
      @confirm="confirmDelete"
    />
  </section>
</template>
