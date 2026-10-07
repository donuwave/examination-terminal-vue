<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { useRequestCode, useResetFlow } from '@/entities/session'
import { BaseButton } from '@/shared/ui/button'
import { BaseInput } from '@/shared/ui/input'
import { Icon } from '@/shared/ui/icon'
import { resetEmailSchema, type ResetEmailValues } from '../model/schema'

const router = useRouter()
const flow = useResetFlow()
const { mutate, isPending } = useRequestCode()

const { errors, defineField, handleSubmit, submitCount } = useForm<ResetEmailValues>({
  validationSchema: resetEmailSchema,
  initialValues: { email: flow.email },
})

// До первой отправки поле не валидируется, дальше проверяется при каждом изменении.
const [email] = defineField('email', () => ({ validateOnModelUpdate: submitCount.value > 0 }))

const onSubmit = handleSubmit((values) => {
  if (isPending.value) return
  mutate(values, {
    onSuccess: () => {
      flow.reset()
      flow.email = values.email
      router.push({ name: 'reset-password-code' })
    },
  })
})
</script>

<template>
  <div>
    <h1 class="reveal text-center text-4xl font-extrabold tracking-tight">Сброс пароля</h1>
    <p class="reveal mt-3 text-center text-base text-ink-soft" style="--d: 60ms">
      Укажите почту, и мы отправим на неё код подтверждения
    </p>

    <form class="reveal mt-10" style="--d: 120ms" novalidate @submit="onSubmit">
      <BaseInput
        v-model="email"
        label="Почта"
        type="email"
        icon="mail"
        autocomplete="email"
        placeholder="name@example.com"
        :error="errors.email"
      />

      <BaseButton class="mt-5" type="submit" :loading="isPending">
        {{ isPending ? 'Отправляем…' : 'Получить код' }}
      </BaseButton>
    </form>

    <div class="reveal my-6 flex items-center gap-4 text-sm text-ink-soft" style="--d: 180ms">
      <span class="h-px flex-1 bg-line" />
      Вспомнили пароль?
      <span class="h-px flex-1 bg-line" />
    </div>

    <BaseButton class="reveal" variant="secondary" to="/auth" style="--d: 240ms">
      <Icon name="arrow-left" size="18" />
      Вернуться ко входу
    </BaseButton>
  </div>
</template>
