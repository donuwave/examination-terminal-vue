import { createRouter, createWebHistory } from 'vue-router'
import { useSession } from '@/entities/session'
import { useResetFlow } from '@/entities/session'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/auth', name: 'auth', component: () => import('@/pages/auth') },
    {
      path: '/registration',
      name: 'registration',
      component: () => import('@/pages/registration'),
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('@/pages/reset-password'),
    },
    {
      path: '/reset-password/code',
      name: 'reset-password-code',
      component: () => import('@/pages/reset-password-code'),
    },
    {
      path: '/reset-password/new',
      name: 'reset-password-new',
      component: () => import('@/pages/reset-password-new'),
    },
    {
      path: '/tests/:id',
      name: 'test-run',
      component: () => import('@/pages/test-run'),
      meta: { requiresAuth: true },
    },
    {
      path: '/',
      component: () => import('@/app/layouts/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: '', name: 'home', component: () => import('@/pages/home') },
        { path: 'courses', name: 'courses', component: () => import('@/pages/courses') },
        { path: 'profile', name: 'profile', component: () => import('@/pages/profile') },
        { path: 'courses/:id', name: 'course', component: () => import('@/pages/course') },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

const GUEST_ROUTES = [
  'auth',
  'registration',
  'reset-password',
  'reset-password-code',
  'reset-password-new',
]

router.beforeEach((to) => {
  const { isAuthed } = useSession()
  if (to.meta.requiresAuth && !isAuthed) return { name: 'auth' }
  if (isAuthed && GUEST_ROUTES.includes(to.name as string)) return { name: 'home' }

  // Шаги сброса пароля нельзя открыть напрямую, минуя предыдущие.
  const flow = useResetFlow()
  if (to.name === 'reset-password-code' && !flow.email) return { name: 'reset-password' }
  if (to.name === 'reset-password-new' && !flow.verified) return { name: 'reset-password' }
})

export default router
