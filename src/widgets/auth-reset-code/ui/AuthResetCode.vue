<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { useRequestCode, useResetFlow, useVerifyCode } from '@/entities/session'
import { BaseButton } from '@/shared/ui/button'
import { OtpInput } from '@/shared/ui/otp-input'
import { Icon } from '@/shared/ui/icon'
import { toastError } from '@/shared/ui/toast'
import { CODE_LENGTH, resetCodeSchema, type ResetCodeValues } from '../model/schema'

const RESEND_SECONDS = 30

const router = useRouter()
const flow = useResetFlow()
const { mutate: verify, isPending } = useVerifyCode()
const { mutate: resend, isPending: isResending } = useRequestCode()

const { errors, defineField, handleSubmit, setErrors, submitCount } = useForm<ResetCodeValues>({
  validationSchema: resetCodeSchema,
  initialValues: { code: '' },
})

const [code] = defineField('code', () => ({ validateOnModelUpdate: submitCount.value > 0 }))

const onSubmit = handleSubmit((values) => {
  if (isPending.value) return
  verify(
    { email: flow.email, code: values.code },
    {
      onSuccess: () => {
        flow.verified = true
        router.push({ name: 'reset-password-new' })
      },
      onError: () => setErrors({ code: 'Неверный код' }),
    },
  )
})

// Когда введены все цифры, отправляем без нажатия кнопки.
watch(code, (value) => {
  if (value?.length === CODE_LENGTH) onSubmit()
})

const cooldown = ref(RESEND_SECONDS)
let timer: ReturnType<typeof setInterval> | undefined

const startCooldown = () => {
  cooldown.value = RESEND_SECONDS
  clearInterval(timer)
  timer = setInterval(() => {
    cooldown.value -= 1
    if (cooldown.value <= 0) clearInterval(timer)
  }, 1000)
}

const onResend = () => {
  if (cooldown.value > 0 || isResending.value) return
  resend(
    { email: flow.email },
    {
      onSuccess: () => {
        code.value = ''
        startCooldown()
      },
      onError: () => toastError('Не удалось отправить код. Попробуйте позже'),
    },
  )
}

onMounted(startCooldown)
onUnmounted(() => clearInterval(timer))
</script>

<template>
  <div>
    <h1 class="reveal text-center text-4xl font-extrabold tracking-tight">Введите код</h1>
    <p class="reveal mt-3 text-center text-base text-ink-soft" style="--d: 60ms">
      Мы отправили {{ CODE_LENGTH }}-значный код на
      <span class="font-semibold text-ink">{{ flow.email }}</span>
    </p>

    <form class="reveal mt-10" style="--d: 120ms" novalidate @submit="onSubmit">
      <OtpInput v-model="code" label="Код из письма" :length="CODE_LENGTH" :error="errors.code" />

      <BaseButton class="mt-5" type="submit" :loading="isPending">
        {{ isPending ? 'Проверяем…' : 'Подтвердить' }}
      </BaseButton>
    </form>

    <p class="reveal mt-5 text-center text-sm text-ink-soft" style="--d: 180ms">
      Не пришёл код?
      <span v-if="cooldown > 0">Отправить снова через {{ cooldown }} с</span>
      <button
        v-else
        type="button"
        class="font-semibold text-brand hover:underline disabled:opacity-60"
        :disabled="isResending"
        @click="onResend"
      >
        Отправить снова
      </button>
    </p>

    <BaseButton class="reveal mt-6" variant="secondary" to="/reset-password" style="--d: 240ms">
      <Icon name="arrow-left" size="18" />
      Изменить почту
    </BaseButton>
  </div>
</template>
