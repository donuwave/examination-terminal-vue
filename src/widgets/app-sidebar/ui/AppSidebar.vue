<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useQueryClient } from '@tanstack/vue-query'
import { useSession } from '@/entities/session'
import { Icon, type IconName } from '@/shared/ui/icon'

const router = useRouter()
const session = useSession()
const queryClient = useQueryClient()

const items: { to: string; icon: IconName; label: string; exact?: boolean }[] = [
  { to: '/', icon: 'home', label: 'Главная', exact: true },
  { to: '/courses', icon: 'book', label: 'Курсы' },
  { to: '/profile', icon: 'user', label: 'Профиль' },
]

const logout = () => {
  session.clear()
  queryClient.clear()
  router.replace({ name: 'auth' })
}
</script>

<template>
  <aside
    class="card sticky top-4 m-4 flex h-[calc(100vh-2rem)] w-[72px] shrink-0 flex-col items-center py-5"
  >
    <nav class="flex flex-1 flex-col items-center gap-2">
      <RouterLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        :title="item.label"
        :aria-label="item.label"
        class="grid h-11 w-11 place-items-center rounded-xl text-ink-soft transition duration-200 hover:bg-canvas hover:text-ink"
        exact-active-class="!bg-brand-soft !text-brand"
        :active-class="item.exact ? '' : '!bg-brand-soft !text-brand'"
      >
        <Icon :name="item.icon" size="22" />
      </RouterLink>
    </nav>

    <button
      type="button"
      title="Выйти"
      aria-label="Выйти"
      class="grid h-11 w-11 place-items-center rounded-xl text-ink-soft transition duration-200 hover:bg-red-50 hover:text-red-600"
      @click="logout"
    >
      <Icon name="logout" size="22" />
    </button>
  </aside>
</template>
