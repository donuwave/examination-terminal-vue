<script setup lang="ts">
import { useStartTest, type TestProgress } from '@/entities/test-progress'
import { formatDeadline, formatDuration, pluralize } from '@/shared/lib'
import { BaseButton } from '@/shared/ui/button'

const props = defineProps<{ progress: TestProgress }>()

const { mutate, isPending } = useStartTest(() => props.progress.id)

const expired = props.progress.status === 4
const count = props.progress.result_test.length

const facts = [
  { label: 'Вопросов', value: `${count}` },
  { label: 'Время на тест', value: formatDuration(props.progress.timelimit) },
  { label: 'Сдать до', value: formatDeadline(props.progress.deadline_date) },
]
</script>

<template>
  <section class="card mx-auto max-w-xl p-8">
    <h1 class="text-3xl font-extrabold leading-tight tracking-tight">{{ progress.test.name }}</h1>
    <p class="mt-2 text-ink-soft">
      {{
        expired
          ? 'Срок сдачи вышел, пройти этот тест уже нельзя.'
          : `${count} ${pluralize(count, ['вопрос', 'вопроса', 'вопросов'])}, на каждый один правильный ответ.`
      }}
    </p>

    <dl class="mt-6 space-y-2">
      <div
        v-for="fact in facts"
        :key="fact.label"
        class="flex items-center justify-between gap-3 rounded-2xl bg-canvas px-4 py-3.5"
      >
        <dt class="text-sm text-ink-soft">{{ fact.label }}</dt>
        <dd class="font-bold">{{ fact.value }}</dd>
      </div>
    </dl>

    <template v-if="!expired">
      <p class="mt-5 text-sm leading-relaxed text-ink-soft">
        Таймер запустится сразу после нажатия и не остановится, даже если вы закроете страницу.
        Ответы сохраняются по ходу. Когда время выйдет, тест завершится сам.
      </p>
      <BaseButton class="mt-6" :loading="isPending" @click="mutate()">
        {{ isPending ? 'Запускаем…' : 'Начать тест' }}
      </BaseButton>
    </template>
  </section>
</template>
