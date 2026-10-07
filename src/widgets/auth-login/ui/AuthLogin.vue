<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { object, string } from 'yup'
import { useLogin, useSession } from '@/entities/session'
import { Icon } from '@/shared/ui/icon'

const router = useRouter()
const session = useSession()
const { mutate, isPending } = useLogin()

const showPassword = ref(false)

const { errors, defineField, handleSubmit, setErrors, submitCount } = useForm({
  validationSchema: object({
    email: string().trim().required('Введите почту').email('Некорректная почта'),
    password: string().required('Введите пароль'),
  }),
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

const invalidClass =
  'border-red-500 bg-red-50/50 ring-4 ring-red-100 focus:border-red-500 focus:ring-red-100'
</script>

<template>
  <div>
    <h1 class="reveal text-center text-4xl font-extrabold tracking-tight">С возвращением!</h1>
    <p class="reveal mt-3 text-center text-base text-ink-soft" style="--d: 60ms">
      Войдите в свой аккаунт
    </p>

    <form class="reveal mt-10 space-y-5" style="--d: 120ms" novalidate @submit="onSubmit">
      <label class="block">
        <span class="mb-2 block text-sm font-semibold">Почта</span>
        <div class="relative">
          <Icon
            name="mail"
            size="20"
            class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft"
          />
          <input
            v-model="email"
            class="input pl-12"
            :class="errors.email && invalidClass"
            type="email"
            autocomplete="email"
            placeholder="name@example.com"
          />
        </div>
        <Transition name="msg">
          <p v-if="errors.email?.trim()" class="mt-2 text-sm text-red-600">{{ errors.email }}</p>
        </Transition>
      </label>
      <label class="block">
        <span class="mb-2 block text-sm font-semibold">Пароль</span>
        <div class="relative">
          <Icon
            name="lock"
            size="20"
            class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft"
          />
          <input
            v-model="password"
            class="input px-12"
            :class="errors.password && invalidClass"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            placeholder="Введите пароль"
          />
          <button
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-ink-soft transition hover:text-ink"
            :aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'"
            @click="showPassword = !showPassword"
          >
            <Transition name="icon-swap" mode="out-in">
              <Icon
                :key="String(showPassword)"
                :name="showPassword ? 'eye' : 'eye-off'"
                size="20"
              />
            </Transition>
          </button>
        </div>
        <Transition name="msg">
          <p v-if="errors.password?.trim()" class="mt-2 text-sm text-red-600">
            {{ errors.password }}
          </p>
        </Transition>
        <p class="mt-3 text-sm text-ink-soft">
          Забыли пароль?
          <button type="button" class="font-semibold text-brand hover:underline">Сбросить</button>
        </p>
      </label>

      <button class="btn w-full" type="submit" :disabled="isPending">
        <span
          v-if="isPending"
          class="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
        />
        {{ isPending ? 'Входим…' : 'Войти' }}
      </button>
    </form>

    <div class="reveal my-6 flex items-center gap-4 text-sm text-ink-soft" style="--d: 180ms">
      <span class="h-px flex-1 bg-line" />
      Впервые у нас?
      <span class="h-px flex-1 bg-line" />
    </div>

    <button type="button" class="btn-outline reveal" style="--d: 240ms">Регистрация</button>
  </div>
</template>
