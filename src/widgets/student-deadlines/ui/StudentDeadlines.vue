<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { StatusChip, useTestProgress, type TestProgress } from '@/entities/test-progress'
import { buildDays, dayKey, formatDuration, formatTime, isSoon, pluralize } from '@/shared/lib'
import { Icon } from '@/shared/ui/icon'
import { ScrollArea } from '@/shared/ui/scroll-area'

const props = withDefaults(defineProps<{ days?: number }>(), { days: 10 })

/** Слотов в столбце: если тестов больше, последний слот показывает «+N». */
const SLOTS = 3

const visibleOf = (key: string) => {
  const items = itemsOf(key)
  return items.length > SLOTS ? items.slice(0, SLOTS - 1) : items
}

type Slot =
  | { kind: 'item'; item: TestProgress }
  | { kind: 'more'; count: number }
  | { kind: 'empty' }

/** Слоты столбца снизу вверх: тесты, при переполнении «+N», остальное пустые «места». */
const slotsOf = (key: string): Slot[] => {
  const visible = visibleOf(key)
  const hidden = hiddenCount(key)
  return Array.from({ length: SLOTS }, (_, index): Slot => {
    if (index < visible.length) return { kind: 'item', item: visible[index] }
    if (hidden && index === SLOTS - 1) return { kind: 'more', count: hidden }
    return { kind: 'empty' }
  })
}

const hiddenCount = (key: string) => Math.max(0, itemsOf(key).length - visibleOf(key).length)

const { data, isPending } = useTestProgress()

const calendar = computed(() => buildDays(props.days))

/** Открытые попытки: готовы к прохождению или уже начаты. */
const open = computed(() =>
  (data.value ?? [])
    .filter((item) => item.status === 1 || item.status === 2)
    .sort((a, b) => a.deadline_date - b.deadline_date),
)

const byDay = computed(() => {
  const groups = new Map<string, TestProgress[]>()
  for (const item of open.value) {
    const key = dayKey(item.deadline_date)
    groups.set(key, [...(groups.get(key) ?? []), item])
  }
  return groups
})

const itemsOf = (key: string) => byDay.value.get(key) ?? []

const later = computed(() => {
  const last = calendar.value[calendar.value.length - 1]?.key
  return open.value.filter((item) => dayKey(item.deadline_date) > last).length
})

const selected = ref('')
watchEffect(() => {
  if (selected.value || isPending.value || !calendar.value.length) return
  const firstBusy = calendar.value.find((day) => itemsOf(day.key).length)
  selected.value = (firstBusy ?? calendar.value[0]).key
})

/** Направление смены дня: вперёд (+) или назад (−), от него зависит, откуда выезжает список. */
const direction = ref<'next' | 'prev'>('next')

const select = (key: string) => {
  if (key === selected.value) return
  const keys = calendar.value.map((day) => day.key)
  direction.value = keys.indexOf(key) > keys.indexOf(selected.value) ? 'next' : 'prev'
  selected.value = key
}

const selectedDay = computed(() => calendar.value.find((day) => day.key === selected.value))
const selectedItems = computed(() => itemsOf(selected.value))

/** Цвет блока кодирует срочность: меньше суток, уже начат, ещё есть время. */
const blockClass = (item: TestProgress) => {
  if (isSoon(item.deadline_date)) return 'border-red-400 bg-pastel-rose text-red-800'
  if (item.status === 2) return 'border-amber-400 bg-pastel-peach text-amber-900'
  return 'border-brand/45 bg-brand-soft text-brand'
}

const legend = [
  { label: 'меньше суток', dot: 'border-red-400 bg-pastel-rose' },
  { label: 'в процессе', dot: 'border-amber-400 bg-pastel-peach' },
  { label: 'есть время', dot: 'border-brand/45 bg-brand-soft' },
]
</script>

<template>
  <section class="card p-6">
    <div class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
      <h2 class="text-xl font-extrabold">Ближайшие дедлайны</h2>
      <ul class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft">
        <li v-for="item in legend" :key="item.label" class="flex items-center gap-1.5">
          <span class="h-2.5 w-2.5 rounded-[4px] border-[1.5px]" :class="item.dot" />
          {{ item.label }}
        </li>
      </ul>
    </div>

    <div
      class="-mx-2 mt-5 overflow-x-auto px-2 [scrollbar-width:none] max-sm:[mask-image:linear-gradient(to_right,black_calc(100%-32px),transparent)] [&::-webkit-scrollbar]:hidden"
    >
      <div v-if="isPending" class="flex h-[224px] min-w-[560px] items-end gap-1">
        <div
          v-for="n in days"
          :key="n"
          class="h-full flex-1 animate-pulse rounded-2xl bg-line/60"
        />
      </div>

      <div
        v-else
        class="grid min-w-[560px] gap-1"
        :style="{ gridTemplateColumns: `repeat(${days}, 1fr)` }"
        role="tablist"
      >
        <button
          v-for="(day, column) in calendar"
          :key="day.key"
          type="button"
          role="tab"
          :aria-selected="selected === day.key"
          :aria-label="`${day.title}: ${itemsOf(day.key).length} ${pluralize(itemsOf(day.key).length, ['тест', 'теста', 'тестов'])}`"
          class="flex h-[224px] flex-col rounded-2xl px-1 pt-3 transition duration-200 focus-visible:outline-2 focus-visible:outline-brand"
          :class="selected === day.key ? 'bg-brand-soft/60' : 'hover:bg-canvas'"
          @click="select(day.key)"
        >
          <div class="flex min-h-0 flex-1 flex-col-reverse items-center gap-1.5 pb-3">
            <template v-for="(slot, row) in slotsOf(day.key)" :key="row">
              <span
                v-if="slot.kind === 'item'"
                :title="slot.item.test.name"
                class="reveal grid h-9 w-full max-w-[52px] place-items-center rounded-xl border-[1.5px] text-[11px] font-bold tabular-nums shadow-[0_2px_6px_-2px_rgba(31,36,48,.2)]"
                :class="blockClass(slot.item)"
                :style="{ '--d': `${column * 40 + row * 70}ms` }"
              >
                {{ formatTime(slot.item.deadline_date) }}
              </span>
              <span
                v-else-if="slot.kind === 'more'"
                class="grid h-9 w-full max-w-[52px] place-items-center rounded-xl border-[1.5px] border-ink/15 bg-canvas text-xs font-bold text-ink-soft"
              >
                +{{ slot.count }}
              </span>
              <span
                v-else
                class="h-9 w-full max-w-[52px] rounded-xl border border-dashed"
                :class="selected === day.key ? 'border-brand/25' : 'border-ink/10'"
                aria-hidden="true"
              />
            </template>
          </div>

          <div class="flex flex-col items-center border-t border-line/80 pb-2.5 pt-2.5">
            <span class="text-sm font-semibold" :class="day.isWeekend ? 'text-red-500' : ''">
              {{ day.weekday }}
            </span>
            <span
              class="mt-1 grid h-7 min-w-7 place-items-center rounded-full px-1 text-sm font-bold tabular-nums"
              :class="
                day.isToday ? 'bg-ink text-white' : day.isWeekend ? 'text-red-400' : 'text-ink-soft'
              "
            >
              {{ day.day }}
            </span>
          </div>
        </button>
      </div>
    </div>

    <div class="mt-6">
      <div class="flex items-baseline justify-between gap-3">
        <Transition name="title" mode="out-in">
          <h3 :key="selected" class="font-bold">{{ selectedDay?.title ?? 'Выбранный день' }}</h3>
        </Transition>
        <span v-if="selectedItems.length" class="text-sm text-ink-soft">
          {{ selectedItems.length }}
          {{ pluralize(selectedItems.length, ['тест', 'теста', 'тестов']) }}
        </span>
      </div>

      <!-- Высота фиксирована: на три строки, чтобы блок не прыгал при смене дня. -->
      <div class="relative mt-2 h-[236px] overflow-hidden">
        <Transition :name="`day-${direction}`" mode="out-in">
          <div v-if="isPending" key="loading" class="space-y-3 pt-3">
            <div v-for="n in 3" :key="n" class="h-[60px] animate-pulse rounded-2xl bg-line/60" />
          </div>

          <ScrollArea v-else-if="selectedItems.length" :key="selected" class="h-full">
            <ul class="divide-y divide-line pr-3">
              <li v-for="item in selectedItems" :key="item.id">
                <RouterLink
                  :to="`/tests/${item.id}`"
                  class="grid min-h-[78px] grid-cols-[4rem_1fr] items-center gap-x-4 gap-y-2 py-4 sm:grid-cols-[4rem_1fr_auto] rounded-2xl transition duration-200 hover:bg-canvas/70 sm:-mx-3 sm:px-3"
                >
                  <p class="text-xl font-extrabold tabular-nums">
                    {{ formatTime(item.deadline_date) }}
                  </p>
                  <div class="min-w-0">
                    <p class="font-bold">{{ item.test.name }}</p>
                    <p class="mt-0.5 text-sm text-ink-soft">
                      {{ formatDuration(item.timelimit) }} на прохождение
                    </p>
                  </div>
                  <StatusChip
                    class="col-start-2 justify-self-start sm:col-start-3"
                    :status="item.status"
                  />
                </RouterLink>
              </li>
            </ul>
          </ScrollArea>

          <div
            v-else
            :key="`empty-${selected}`"
            class="grid h-full place-content-center justify-items-center text-center"
          >
            <span class="grid h-14 w-14 place-items-center rounded-2xl bg-canvas text-ink-soft">
              <Icon name="calendar" size="26" />
            </span>
            <p class="mt-3 font-bold">Дедлайнов нет</p>
            <p class="mt-1 text-sm text-ink-soft">На этот день тестов не запланировано</p>
          </div>
        </Transition>
      </div>

      <p v-if="later" class="mt-3 text-sm text-ink-soft">
        Ещё {{ later }} {{ pluralize(later, ['тест', 'теста', 'тестов']) }} позже, чем через
        {{ days }} дней.
      </p>
    </div>
  </section>
</template>

<style scoped>
.day-next-enter-active,
.day-prev-enter-active,
.day-next-leave-active,
.day-prev-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.22s cubic-bezier(0.22, 1, 0.36, 1);
}
.day-next-enter-from,
.day-prev-leave-to {
  opacity: 0;
  transform: translateX(28px);
}
.day-prev-enter-from,
.day-next-leave-to {
  opacity: 0;
  transform: translateX(-28px);
}

.title-enter-active,
.title-leave-active {
  transition:
    opacity 0.12s ease,
    transform 0.15s ease;
}
.title-enter-from,
.title-leave-to {
  opacity: 0;
  transform: translateY(-3px);
}
</style>
