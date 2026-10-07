<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon, type IconName } from '@/shared/ui/icon'

const props = defineProps<{
  label: string
  type?: 'text' | 'email' | 'password'
  placeholder?: string
  autocomplete?: string
  /** Иконка слева. */
  icon?: IconName
  /** Текст ошибки. Пробел подсвечивает поле, но текст не показывает. */
  error?: string
}>()

const model = defineModel<string>({ default: '' })

const revealed = ref(false)
const isPassword = computed(() => props.type === 'password')
const inputType = computed(() => (isPassword.value && revealed.value ? 'text' : props.type))
</script>

<template>
  <label class="block">
    <span class="mb-2 block text-sm font-semibold">{{ label }}</span>
    <div class="relative">
      <Icon
        v-if="icon"
        :name="icon"
        size="20"
        class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft"
      />
      <input
        v-model="model"
        class="w-full rounded-2xl border bg-white py-3.5 text-[15px] outline-none transition duration-200 placeholder:text-ink-soft/60 focus:ring-4"
        :class="[
          icon ? 'pl-12' : 'pl-4',
          isPassword ? 'pr-12' : 'pr-4',
          error
            ? 'border-red-500 bg-red-50/50 ring-4 ring-red-100 focus:border-red-500 focus:ring-red-100'
            : 'border-line hover:border-ink/20 focus:border-brand focus:ring-brand-soft',
        ]"
        :type="inputType"
        :autocomplete="autocomplete"
        :placeholder="placeholder"
      />
      <button
        v-if="isPassword"
        type="button"
        class="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-ink-soft transition hover:text-ink"
        :aria-label="revealed ? 'Скрыть пароль' : 'Показать пароль'"
        @click="revealed = !revealed"
      >
        <Transition name="icon-swap" mode="out-in">
          <Icon :key="String(revealed)" :name="revealed ? 'eye' : 'eye-off'" size="20" />
        </Transition>
      </button>
    </div>
    <div class="mt-1.5 min-h-5">
      <Transition name="msg">
        <p v-if="error?.trim()" class="text-sm leading-5 text-red-600">{{ error }}</p>
      </Transition>
    </div>
    <slot name="hint" />
  </label>
</template>

<style scoped>
.icon-swap-enter-active,
.icon-swap-leave-active,
.msg-enter-active,
.msg-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.icon-swap-enter-from,
.icon-swap-leave-to {
  opacity: 0;
  transform: scale(0.6) rotate(-20deg);
}
.msg-enter-from,
.msg-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
