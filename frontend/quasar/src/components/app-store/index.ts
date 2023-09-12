import type { App, Plugin } from 'vue'
import { default as JLAppStoreConnect } from './Connect.vue'

export default {
	install(Vue: App) {
		Vue.component('JLAppStoreConnect', JLAppStoreConnect)
	},
} as Plugin

export { JLAppStoreConnect }
