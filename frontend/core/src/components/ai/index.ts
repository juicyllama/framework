import type { App, Plugin } from 'vue'
import { default as JLAiAsk } from './Ask.vue'

export default {
	install(Vue: App) {
		Vue.component('JLAiAsk', JLAiAsk)
	},
} as Plugin

export { JLAiAsk }
