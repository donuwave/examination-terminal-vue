import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * Обратный отсчёт от серверного остатка времени.
 * Конец считаем по часам клиента один раз, чтобы таймер не «плыл» между тиками.
 */
export const useCountdown = (initialSeconds: number, onExpire: () => void) => {
  const endsAt = Date.now() + initialSeconds * 1000
  const left = ref(initialSeconds)
  let timer: ReturnType<typeof setInterval> | undefined
  let expired = false

  const tick = () => {
    left.value = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000))
    if (left.value === 0 && !expired) {
      expired = true
      clearInterval(timer)
      onExpire()
    }
  }

  onMounted(() => {
    tick()
    timer = setInterval(tick, 250)
  })
  onBeforeUnmount(() => clearInterval(timer))

  const label = computed(() => {
    const minutes = Math.floor(left.value / 60)
    const seconds = left.value % 60
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  })

  return { left, label }
}
