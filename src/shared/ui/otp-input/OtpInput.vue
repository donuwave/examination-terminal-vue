<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{ label: string; length?: number; error?: string }>(), {
  length: 6,
})

const model = defineModel<string>({ default: '' })

const cells = ref<HTMLInputElement[]>([])
const digits = computed(() => Array.from({ length: props.length }, (_, i) => model.value[i] ?? ''))

const focusCell = (index: number) => {
  const cell = cells.value[Math.min(Math.max(index, 0), props.length - 1)]
  cell?.focus()
  cell?.select()
}

const setDigit = (index: number, digit: string) => {
  const next = digits.value.slice()
  next[index] = digit
  model.value = next.join('').slice(0, props.length)
}

const onInput = (index: number, event: Event) => {
  const value = (event.target as HTMLInputElement).value.replace(/\D/g, '')
  if (!value) {
    setDigit(index, '')
    ;(event.target as HTMLInputElement).value = ''
    return
  }
  // Вставка нескольких цифр сразу (автозаполнение из SMS/почты).
  const chars = value.split('').slice(0, props.length - index)
  const next = digits.value.slice()
  chars.forEach((char, i) => (next[index + i] = char))
  model.value = next.join('')
  focusCell(index + chars.length)
}

const onKeydown = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace' && !digits.value[index]) {
    event.preventDefault()
    setDigit(index - 1, '')
    focusCell(index - 1)
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    focusCell(index - 1)
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    focusCell(index + 1)
  }
}

const onPaste = (event: ClipboardEvent) => {
  const pasted = event.clipboardData?.getData('text').replace(/\D/g, '')
  if (!pasted) return
  event.preventDefault()
  model.value = pasted.slice(0, props.length)
  focusCell(pasted.length)
}

defineExpose({ focus: () => focusCell(0) })
</script>

<template>
  <div>
    <span class="mb-2 block text-sm font-semibold">{{ label }}</span>
    <div class="flex justify-between gap-2" @paste="onPaste">
      <input
        v-for="(digit, index) in digits"
        :key="index"
        :ref="(el) => (cells[index] = el as HTMLInputElement)"
        :value="digit"
        class="h-14 w-full min-w-0 rounded-2xl border bg-white text-center text-xl font-bold outline-none transition duration-200 focus:ring-4"
        :class="
          error
            ? 'border-red-500 bg-red-50/50 ring-4 ring-red-100 focus:border-red-500 focus:ring-red-100'
            : 'border-line hover:border-ink/20 focus:border-brand focus:ring-brand-soft'
        "
        type="text"
        inputmode="numeric"
        maxlength="6"
        :autocomplete="index === 0 ? 'one-time-code' : 'off'"
        :aria-label="`Цифра ${index + 1}`"
        @input="onInput(index, $event)"
        @keydown="onKeydown(index, $event)"
        @focus="($event.target as HTMLInputElement).select()"
      />
    </div>
    <div class="mt-1.5 min-h-5">
      <Transition name="msg">
        <p v-if="error?.trim()" class="text-sm leading-5 text-red-600">{{ error }}</p>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.msg-enter-active,
.msg-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.msg-enter-from,
.msg-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
