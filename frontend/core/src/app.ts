import { createApp } from 'vue'
import App from './App.vue'
import { Quasar } from 'quasar'
import { createPinia } from 'pinia'
import {  JLUpload } from '@/components'

// Import Quasar css
import 'quasar/src/css/index.sass'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(Quasar, {
	plugins: {}, // import Quasar plugins and add here
})

app.component('JLUpload', JLUpload)

app.mount('#app')
