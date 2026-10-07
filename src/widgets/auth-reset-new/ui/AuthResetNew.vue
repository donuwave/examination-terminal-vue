<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { useResetFlow, useSetNewPassword } from '@/entities/session'
import { BaseButton } from '@/shared/ui/button'
import { BaseInput } from '@/shared/ui/input'
import { Icon } from '@/shared/ui/icon'
import { resetNewSchema, type ResetNewValues } from '../model/schema'

const flow = useResetFlow()
const { mutate, isPending } = useSetNewPassword()
const done = ref(false)

const { errors, defineField, handleSubmit, submitCount } = useForm<ResetNewValues>({
  validationSchema: resetNewSchema,
  initialValues: { password: '', passwordRepeat: '' },
})

const config = () => ({ validateOnModelUpdate: submitCount.value > 0 })
const [password] = defineField('password', config)
const [passwordRepeat] = defineField('passwordRepeat', config)

const onSubmit = handleSubmit((values) => {
  if (isPending.value) return
  mutate(
    { email: flow.email, password: values.password },
    {
      onSuccess: () => {
        flow.reset()
        done.value = true
      },
    },
  )
})
</script>

<template>
  <div>
    <Transition name="swap" mode="out-in">
      <div v-if="!done" key="form">
        <h1 class="reveal text-center text-4xl font-extrabold tracking-tight">Новый пароль</h1>
        <p class="reveal mt-3 text-center text-base text-ink-soft" style="--d: 60ms">
          Придумайте пароль, которым будете входить
        </p>

        <form class="reveal mt-10" style="--d: 120ms" novalidate @submit="onSubmit">
          <BaseInput
            v-model="password"
            label="Новый пароль"
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

          <BaseButton class="mt-5" type="submit" :loading="isPending">
            {{ isPending ? 'Сохраняем…' : 'Сохранить пароль' }}
          </BaseButton>
        </form>
      </div>

      <div v-else key="done" class="text-center">
        <span
          class="mx-auto grid h-16 w-16 place-items-center rounded-full bg-pastel-mint text-emerald-700"
        >
          <Icon name="check" size="30" />
        </span>
        <h1 class="mt-6 text-4xl font-extrabold tracking-tight">Пароль изменён</h1>
        <p class="mt-3 text-base text-ink-soft">Теперь можно войти с новым паролем</p>
        <BaseButton class="mt-8" to="/auth">Войти</BaseButton>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.swap-enter-active,
.swap-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.swap-enter-from,
.swap-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
