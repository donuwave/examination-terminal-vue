<script setup lang="ts">
import { useForm } from 'vee-validate'
import { useUpdateProfile, type Gender, type Profile } from '@/entities/profile'
import { BaseButton } from '@/shared/ui/button'
import { BaseInput } from '@/shared/ui/input'
import { toastSuccess } from '@/shared/ui/toast'
import { profileSchema, type ProfileFormValues } from '../model/schema'

const props = defineProps<{ profile: Profile }>()

const { mutate, isPending } = useUpdateProfile()

const toFormValues = (profile: Profile): ProfileFormValues => ({
  first_name: profile.first_name ?? '',
  last_name: profile.last_name ?? '',
  age: profile.age ? String(profile.age) : '',
  gender: profile.gender,
})

const { errors, defineField, handleSubmit, meta, resetForm, submitCount } =
  useForm<ProfileFormValues>({
    validationSchema: profileSchema,
    initialValues: toFormValues(props.profile),
  })

// До первой отправки поля не валидируются, дальше проверяются при каждом изменении.
const config = () => ({ validateOnModelUpdate: submitCount.value > 0 })
const [firstName] = defineField('first_name', config)
const [lastName] = defineField('last_name', config)
const [age] = defineField('age', config)
const [gender] = defineField('gender', config)

const genders: { value: Gender; label: string }[] = [
  { value: 1, label: 'Женский' },
  { value: 2, label: 'Мужской' },
]

const toggleGender = (value: Gender) => {
  gender.value = gender.value === value ? null : value
}

const onSubmit = handleSubmit((values) => {
  if (isPending.value) return
  mutate(
    {
      first_name: values.first_name || null,
      last_name: values.last_name || null,
      age: values.age ? Number(values.age) : null,
      gender: values.gender ?? null,
    },
    {
      onSuccess: (profile) => {
        resetForm({ values: toFormValues(profile) })
        toastSuccess('Профиль сохранён')
      },
    },
  )
})
</script>

<template>
  <section class="card p-7">
    <h2 class="text-2xl font-extrabold tracking-tight">Личные данные</h2>
    <p class="mt-1 text-sm text-ink-soft">
      Имя видят преподаватели и студенты ваших курсов. Почту и роль изменить нельзя.
    </p>

    <form class="mt-6" novalidate @submit="onSubmit">
      <div class="grid gap-x-4 sm:grid-cols-2">
        <BaseInput
          v-model="firstName"
          label="Имя"
          autocomplete="given-name"
          placeholder="Например, Алексей"
          :error="errors.first_name"
        />
        <BaseInput
          v-model="lastName"
          label="Фамилия"
          autocomplete="family-name"
          placeholder="Например, Кузнецов"
          :error="errors.last_name"
        />
      </div>

      <div class="grid gap-x-4 sm:grid-cols-2">
        <BaseInput
          v-model="age"
          label="Возраст"
          inputmode="numeric"
          :maxlength="3"
          placeholder="Полных лет"
          :error="errors.age"
        />

        <div>
          <span class="mb-2 block text-sm font-semibold">Пол</span>
          <div class="grid grid-cols-2 gap-2" role="group" aria-label="Пол">
            <button
              v-for="option in genders"
              :key="option.value"
              type="button"
              class="rounded-2xl border px-4 py-3.5 text-[15px] font-medium transition duration-200 active:scale-[.98]"
              :class="
                gender === option.value
                  ? 'border-brand bg-brand-soft text-brand'
                  : 'border-line bg-white hover:border-ink/20'
              "
              :aria-pressed="gender === option.value"
              @click="toggleGender(option.value)"
            >
              {{ option.label }}
            </button>
          </div>
          <div class="mt-1.5 min-h-5" />
        </div>
      </div>

      <div class="mt-2 flex flex-wrap items-center justify-end gap-3">
        <BaseButton
          class="!w-auto"
          variant="secondary"
          :disabled="!meta.dirty || isPending"
          @click="resetForm({ values: toFormValues(profile) })"
        >
          Сбросить
        </BaseButton>
        <BaseButton class="!w-auto" type="submit" :loading="isPending" :disabled="!meta.dirty">
          {{ isPending ? 'Сохраняем…' : 'Сохранить' }}
        </BaseButton>
      </div>
    </form>
  </section>
</template>
