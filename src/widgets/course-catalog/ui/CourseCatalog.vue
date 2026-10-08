<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  CourseCard,
  useCatalog,
  useCategories,
  useCourses,
  type CatalogCourse,
} from '@/entities/course'
import { useProfile } from '@/entities/profile'
import { pluralize } from '@/shared/lib'
import { BaseButton } from '@/shared/ui/button'
import { Icon } from '@/shared/ui/icon'
import { ScrollArea } from '@/shared/ui/scroll-area'
import CourseCreateDialog from './CourseCreateDialog.vue'
import CourseJoinDialog from './CourseJoinDialog.vue'

const SEARCH_DELAY = 300

const route = useRoute()
const router = useRouter()
const { data: profile } = useProfile()
const { data: categories } = useCategories()

const isTeacher = computed(() => profile.value?.role.name === 'Преподаватель')

// Фильтры живут в адресе, поэтому переживают перезагрузку и работают со ссылками.
const search = computed(() => String(route.query.q ?? ''))
const categoryId = computed(() => (route.query.category ? Number(route.query.category) : null))

const scope = computed<'mine' | 'all'>(() => (route.query.scope === 'all' ? 'all' : 'mine'))

const searchInput = ref(search.value)
let timer: ReturnType<typeof setTimeout> | undefined

const setQuery = (patch: { q?: string; category?: number | null; scope?: 'mine' | 'all' }) => {
  const query = { ...route.query }
  if (patch.scope !== undefined) patch.scope === 'all' ? (query.scope = 'all') : delete query.scope
  if (patch.q !== undefined) patch.q ? (query.q = patch.q) : delete query.q
  if (patch.category !== undefined)
    patch.category ? (query.category = String(patch.category)) : delete query.category
  router.replace({ query })
}

watch(searchInput, (value) => {
  clearTimeout(timer)
  timer = setTimeout(() => setQuery({ q: value.trim() }), SEARCH_DELAY)
})

const filters = () => ({ search: search.value, categoryId: categoryId.value })

const mine = useCourses(filters)
const all = useCatalog(filters, () => scope.value === 'all')

const courses = computed(() => (scope.value === 'all' ? all.data.value : mine.data.value))
const isPending = computed(() =>
  scope.value === 'all' ? all.isPending.value : mine.isPending.value,
)

/** Курс из каталога, где пользователь не участвует: показываем предпросмотр, а не страницу. */
const isOutsider = (course: unknown): course is CatalogCourse =>
  scope.value === 'all' && !(course as CatalogCourse).is_member

const previewCourse = ref<CatalogCourse | null>(null)
const previewOpen = ref(false)

const openPreview = (course: CatalogCourse) => {
  previewCourse.value = course
  previewOpen.value = true
}

const filtered = computed(() => Boolean(search.value || categoryId.value))

const reset = () => {
  searchInput.value = ''
  router.replace({ query: scope.value === 'all' ? { scope: 'all' } : {} })
}

const createOpen = ref(false)
</script>

<template>
  <div class="lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
    <div class="shrink-0">
      <div
        class="mb-5 inline-flex rounded-2xl bg-white p-1 shadow-card ring-1 ring-line"
        role="tablist"
        aria-label="Какие курсы показывать"
      >
        <button
          v-for="tab in [
            { value: 'mine', label: 'Мои курсы' },
            { value: 'all', label: 'Все курсы' },
          ] as const"
          :key="tab.value"
          type="button"
          role="tab"
          :aria-selected="scope === tab.value"
          class="rounded-xl px-5 py-2 text-sm font-semibold transition duration-200"
          :class="
            scope === tab.value ? 'bg-brand text-white shadow-sm' : 'text-ink-soft hover:text-ink'
          "
          @click="setQuery({ scope: tab.value })"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="relative min-w-[240px] flex-1 sm:max-w-sm">
          <Icon
            name="search"
            size="20"
            class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft"
          />
          <input
            v-model="searchInput"
            type="search"
            placeholder="Поиск по названию и описанию"
            class="w-full rounded-2xl border border-line bg-white py-3 pl-12 pr-4 text-[15px] outline-none transition duration-200 placeholder:text-ink-soft/60 hover:border-ink/20 focus:border-brand focus:ring-4 focus:ring-brand-soft"
          />
        </div>
        <BaseButton v-if="isTeacher" class="!w-auto" @click="createOpen = true">
          <Icon name="plus" size="18" />
          Создать курс
        </BaseButton>
      </div>

      <div class="mt-4 flex flex-wrap gap-2" role="group" aria-label="Тип курса">
        <button
          type="button"
          class="rounded-full border px-4 py-2 text-sm font-medium transition duration-200 active:scale-[.97]"
          :class="
            !categoryId
              ? 'border-brand bg-brand-soft text-brand'
              : 'border-line bg-white hover:border-ink/20'
          "
          :aria-pressed="!categoryId"
          @click="setQuery({ category: null })"
        >
          Все
        </button>
        <button
          v-for="category in categories"
          :key="category.id"
          type="button"
          class="rounded-full border px-4 py-2 text-sm font-medium transition duration-200 active:scale-[.97]"
          :class="
            categoryId === category.id
              ? 'border-brand bg-brand-soft text-brand'
              : 'border-line bg-white hover:border-ink/20'
          "
          :aria-pressed="categoryId === category.id"
          @click="setQuery({ category: category.id })"
        >
          {{ category.name }}
        </button>
      </div>

      <p v-if="courses" class="mt-6 text-sm text-ink-soft">
        {{ courses.length }} {{ pluralize(courses.length, ['курс', 'курса', 'курсов']) }}
      </p>
    </div>

    <ScrollArea class="-mx-2 mt-3 lg:min-h-0 lg:flex-1">
      <div class="px-2 pb-4 pr-4">
        <div v-if="isPending" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div v-for="n in 6" :key="n" class="h-[168px] animate-pulse rounded-card bg-line/60" />
        </div>

        <div v-else-if="courses?.length" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <CourseCard
            v-for="course in courses"
            :key="course.id"
            :course="course"
            :viewer="isTeacher ? 'teacher' : 'student'"
            :preview="isOutsider(course)"
            @select="openPreview(course as CatalogCourse)"
          />
        </div>

        <div v-else class="card flex flex-col items-center px-6 py-12 text-center">
          <span class="grid h-14 w-14 place-items-center rounded-2xl bg-canvas text-ink-soft">
            <Icon name="search" size="26" />
          </span>
          <template v-if="filtered">
            <p class="mt-3 font-bold">Ничего не найдено</p>
            <p class="mt-1 text-sm text-ink-soft">Попробуйте изменить запрос или тип курса.</p>
            <BaseButton class="mt-5 !w-auto" variant="secondary" @click="reset">
              Сбросить фильтры
            </BaseButton>
          </template>
          <template v-else-if="isTeacher">
            <p class="mt-3 font-bold">Курсов пока нет</p>
            <p class="mt-1 text-sm text-ink-soft">Создайте первый курс, и он появится здесь.</p>
            <BaseButton class="mt-5 !w-auto" @click="createOpen = true">Создать курс</BaseButton>
          </template>
          <template v-else>
            <p class="mt-3 font-bold">Вас пока не добавили ни на один курс</p>
            <p class="mt-1 text-sm text-ink-soft">
              Откройте вкладку «Все курсы» и запишитесь на подходящий.
            </p>
            <BaseButton class="mt-5 !w-auto" @click="setQuery({ scope: 'all' })">
              Найти курс
            </BaseButton>
          </template>
        </div>
      </div>
    </ScrollArea>

    <CourseCreateDialog v-if="isTeacher" v-model="createOpen" />
    <CourseJoinDialog v-model="previewOpen" :course="previewCourse" :can-join="!isTeacher" />
  </div>
</template>
