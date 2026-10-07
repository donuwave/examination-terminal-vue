<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { useRegistration, useSession } from '@/entities/session'
import { RoleCard, useRoles } from '@/entities/role'
import { BaseButton } from '@/shared/ui/button'
import { BaseInput } from '@/shared/ui/input'
import { registrationSchema, type RegistrationValues } from '../model/schema'

const router = useRouter()
const session = useSession()
const { mutate, isPending } = useRegistration()
const { data: roles, isPending: rolesPending } = useRoles()

const { errors, defineField, handleSubmit } = useForm<RegistrationValues>({
  validationSchema: registrationSchema,
  initialValues: { email: '', password: '', passwordRepeat: '' },
})

// До первой отправки поля не валидируются, дальше проверяются при каждом изменении.
const submitted = ref(false)
const config = () => ({ validateOnModelUpdate: submitted.value })

const [email] = defineField('email', config)
const [password] = defineField('password', config)
const [passwordRepeat] = defineField('passwordRepeat', config)
const [roleId] = defineField('roleId', config)

const onSubmit = handleSubmit(
  (values) => {
    if (isPending.value) return
    mutate(
      { email: values.email, password: values.password, roleId: values.roleId },
      {
        onSuccess: (tokens) => {
          session.set(tokens)
          router.replace({ name: 'home' })
        },
      },
    )
  },
  () => {
    submitted.value = true
  },
)
</script>

<template>
  <div>
    <h1 class="reveal text-center text-4xl font-extrabold tracking-tight">Создать аккаунт</h1>
    <p class="reveal mt-3 text-center text-base text-ink-soft" style="--d: 60ms">
      Пара шагов, и можно начинать
    </p>

    <form class="reveal mt-10" style="--d: 120ms" novalidate @submit="onSubmit">
      <div>
        <span class="mb-2 block text-sm font-semibold">Кто вы</span>
        <div class="grid grid-cols-2 gap-3">
          <template v-if="rolesPending">
            <div v-for="n in 2" :key="n" class="h-[76px] animate-pulse rounded-2xl bg-line" />
          </template>
          <RoleCard
            v-for="role in roles"
            v-else
            :key="role.id"
            :role="role"
            :selected="roleId === role.id"
            :invalid="!!errors.roleId"
            @click="roleId = role.id"
          />
        </div>
        <div class="mt-1.5 min-h-5">
          <p v-if="errors.roleId" class="text-sm leading-5 text-red-600">{{ errors.roleId }}</p>
        </div>
      </div>

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
        autocomplete="new-password"
        placeholder="Не меньше 6 символов"
        :error="errors.password"
      />

      <BaseInput
        v-model="passwordRepeat"
        label="Повторите пароль"
        type="password"
        icon="lock"
        autocomplete="new-password"
        placeholder="Ещё раз пароль"
        :error="errors.passwordRepeat"
      />

      <BaseButton class="mt-2" type="submit" :loading="isPending">
        {{ isPending ? 'Создаём…' : 'Зарегистрироваться' }}
      </BaseButton>
    </form>

    <div class="reveal my-6 flex items-center gap-4 text-sm text-ink-soft" style="--d: 180ms">
      <span class="h-px flex-1 bg-line" />
      Уже есть аккаунт?
      <span class="h-px flex-1 bg-line" />
    </div>

    <BaseButton class="reveal" variant="secondary" to="/auth" style="--d: 240ms">Войти</BaseButton>
  </div>
</template>
