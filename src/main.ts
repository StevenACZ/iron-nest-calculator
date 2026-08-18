import { createApp } from 'vue'
import App from './App.vue'
import './base.css'
import { lang } from './lib/i18n.ts'

document.documentElement.lang = lang.value
createApp(App).mount('#app')
