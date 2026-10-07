<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  courseColor,
  personInitials,
  personName,
  useAddStudents,
  useStudentCandidates,
} from '@/entities/course'
import { BaseButton } from '@/shared/ui/button'
import { BaseDialog } from '@/shared/ui/dialog'
import { Icon } from '@/shared/ui/icon'
import { ScrollArea } from '@/shared/ui/scroll-area'
import { toastSuccess } from '@/shared/ui/toast'

const props = defineProps<{ courseId: number }>()
const open = defineModel<boolean>({ default: false })

const SEARCH_DELAY = 300

const searchInput = ref('')
const search = ref('')
const selected = ref<number[]>([])
let timer: ReturnType<typeof setTimeout> | undefined

watch(searchInput, (value) => {
  clearTimeout(timer)
  timer = setTimeout(() => (search.value = value), SEARCH_DELAY)
})

const { data: candidates, isPending } = useStudentCandidates(() => props.courseId, search, open)
const { mutate, isPending: isAdding } = useAddStudents(() => props.courseId)

const toggle = (id: number) => {
  selected.value = selected.value.includes(id)
    ? selected.value.filter((item) => item !== id)
    : [...selected.value, id]
}

const submit = () => {
  if (!selected.value.length || isAdding.value) return
  mutate(selected.value, {
    onSuccess: () => {
      open.value = false
      toastSuccess(selected.value.length > 1 ? 'Студенты добавлены' : 'Студент добавлен')
    },
  })
}

watch(open, (isOpen) => {
  if (isOpen) return
  searchInput.value = ''
  search.value = ''
  selected.value = []
})
</script>

<template>
  <BaseDialog v-model="open" title="Добавить студентов" max-width="max-w-lg">
    <h2 class="text-xl font-extrabold">Добавить студентов</h2>
    <p class="mt-1 text-sm text-ink-soft">Показаны студенты, которых ещё нет в курсе.</p>

    <div class="relative mt-4">
      <Icon
        name="search"
        size="20"
        class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft"
      />
      <input
        v-model="searchInput"
        type="search"
        placeholder="Имя или почта"
        class="w-full rounded-2xl border border-line bg-white py-3 pl-12 pr-4 text-[15px] outline-none transition duration-200 placeholder:text-ink-soft/60 hover:border-ink/20 focus:border-brand focus:ring-4 focus:ring-brand-soft"
      />
    </div>

    <div class="mt-3 h-[300px]">
      <div v-if="isPending" class="space-y-2">
        <div v-for="n in 4" :key="n" class="h-[60px] animate-pulse rounded-2xl bg-line/60" />
      </div>

      <ScrollArea v-else-if="candidates?.length" class="h-full">
        <ul class="space-y-2 pr-3">
          <li v-for="student in candidates" :key="student.id">
            <label
              class="flex cursor-pointer items-center gap-3 rounded-2xl border px-3 py-2.5 transition duration-200"
              :class="
                selected.includes(student.id)
                  ? 'border-brand bg-brand-soft/50'
                  : 'border-line hover:border-ink/20'
              "
            >
              <input
                type="checkbox"
                class="h-4 w-4 accent-[#2F6BFF]"
                :checked="selected.includes(student.id)"
                @change="toggle(student.id)"
              />
              <span
                class="grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold"
                :class="courseColor(student.id)"
              >
                {{ personInitials(student) }}
              </span>
              <span class="min-w-0">
                <span class="block truncate font-semibold">{{ personName(student) }}</span>
                <span class="block truncate text-sm text-ink-soft">{{ student.email }}</span>
              </span>
            </label>
          </li>
        </ul>
      </ScrollArea>

      <div v-else class="grid h-full place-content-center text-center">
        <p class="font-bold">{{ search ? 'Никого не нашли' : 'Добавлять некого' }}</p>
        <p class="mt-1 text-sm text-ink-soft">
          {{
            search
              ? 'Попробуйте другое имя или почту.'
              : 'Все зарегистрированные студенты уже в этом курсе.'
          }}
        </p>
      </div>
    </div>

    <div class="mt-5 grid grid-cols-2 gap-3">
      <BaseButton variant="secondary" :disabled="isAdding" @click="open = false">
        Отмена
      </BaseButton>
      <BaseButton :disabled="!selected.length" :loading="isAdding" @click="submit">
        Добавить{{ selected.length ? ` (${selected.length})` : '' }}
      </BaseButton>
    </div>
  </BaseDialog>
</template>
