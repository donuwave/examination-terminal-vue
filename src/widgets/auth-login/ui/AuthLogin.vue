<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { useLogin, useSession } from '@/entities/session'
import { BaseButton } from '@/shared/ui/button'
import { BaseInput } from '@/shared/ui/input'
import { loginSchema, type LoginValues } from '../model/schema'

const router = useRouter()
const session = useSession()
const { mutate, isPending } = useLogin()

const { errors, defineField, handleSubmit, setErrors, submitCount } = useForm<LoginValues>({
  validationSchema: loginSchema,
  initialValues: { email: '', password: '' },
})

// До первой отправки поля не валидируются, дальше проверяются при каждом изменении.
const validateAfterSubmit = () => ({ validateOnModelUpdate: submitCount.value > 0 })

const [email] = defineField('email', validateAfterSubmit)
const [password] = defineField('password', validateAfterSubmit)

// Пробел: поле подсвечивается как невалидное, а текст ошибки уже показан тостом.
const SERVER_ERROR = ' '

const onSubmit = handleSubmit((values) => {
  if (isPending.value) return
  mutate(values, {
    onSuccess: (tokens) => {
      session.set(tokens)
      router.replace({ name: 'home' })
    },
    onError: () => setErrors({ email: SERVER_ERROR, password: SERVER_ERROR }),
  })
})
</script>

<template>
  <div>
    <h1 class="reveal text-center text-4xl font-extrabold tracking-tight">С возвращением!</h1>
    <p class="reveal mt-3 text-center text-base text-ink-soft" style="--d: 60ms">
      Войдите в свой аккаунт
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

      <BaseInput
        v-model="password"
        label="Пароль"
        type="password"
        icon="lock"
        autocomplete="current-password"
        placeholder="Введите пароль"
        :error="errors.password"
      >
        <template #hint>
          <p class="mt-3 text-sm text-ink-soft">
            Забыли пароль?
            <RouterLink to="/reset-password" class="font-semibold text-brand hover:underline">
              Сбросить
            </RouterLink>
          </p>
        </template>
      </BaseInput>

      <BaseButton class="mt-5" type="submit" :loading="isPending">
        {{ isPending ? 'Входим…' : 'Войти' }}
      </BaseButton>
    </form>

    <div class="reveal my-6 flex items-center gap-4 text-sm text-ink-soft" style="--d: 180ms">
      <span class="h-px flex-1 bg-line" />
      Впервые у нас?
      <span class="h-px flex-1 bg-line" />
    </div>

    <BaseButton class="reveal" variant="secondary" to="/registration" style="--d: 240ms">
      Регистрация
    </BaseButton>
  </div>
</template>
