<script setup lang="ts">
import { useProfile } from '@/entities/profile'
import { ProfileForm } from '@/widgets/profile-form'
import { ProfileSummary } from '@/widgets/profile-summary'

const { data: profile, isPending } = useProfile()
</script>

<template>
  <div>
    <header class="reveal">
      <h1 class="text-3xl font-extrabold tracking-tight">Профиль</h1>
      <p class="mt-1 text-ink-soft">Ваши данные и статистика</p>
    </header>

    <div v-if="isPending" class="mt-8 grid gap-6 lg:grid-cols-[minmax(18rem,30%)_1fr]">
      <div class="h-[420px] animate-pulse rounded-card bg-line/60" />
      <div class="h-[420px] animate-pulse rounded-card bg-line/60" />
    </div>

    <div
      v-else-if="profile"
      class="reveal mt-8 grid items-start gap-6 lg:grid-cols-[minmax(18rem,30%)_1fr]"
      style="--d: 80ms"
    >
      <ProfileSummary :profile="profile" />
      <ProfileForm :profile="profile" />
    </div>
  </div>
</template>
