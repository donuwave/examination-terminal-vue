import { createRouter, createWebHistory } from 'vue-router'
import { useSession } from '@/entities/session'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/auth', name: 'auth', component: () => import('@/pages/auth') },
    {
      path: '/',
      component: () => import('@/app/layouts/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [{ path: '', name: 'home', component: () => import('@/pages/home') }],
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to) => {
  const { isAuthed } = useSession()
  if (to.meta.requiresAuth && !isAuthed) return { name: 'auth' }
  if (to.name === 'auth' && isAuthed) return { name: 'home' }
})

export default router
