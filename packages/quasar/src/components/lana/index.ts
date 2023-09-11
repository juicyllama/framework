import type { App, Plugin } from 'vue'
import { default as JLLanaAsk } from './Ask.vue'

export default {
	install(Vue: App) {
		Vue.component('JLLanaAsk', JLLanaAsk)
	},
} as Plugin

export { JLLanaAsk }
