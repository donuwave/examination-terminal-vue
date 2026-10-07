import './styles/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'

import App from './App.vue'
import router from './router'
import { setupHttp } from './providers/http'
import { mountIconSprite } from '@/shared/ui/icon'

const app = createApp(App)
app.use(createPinia()).use(VueQueryPlugin).use(router)
setupHttp()
mountIconSprite()
app.mount('#app')
