import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'mapbox-gl/dist/mapbox-gl.css'
import App from './App.vue'
import '@/app/assets'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')