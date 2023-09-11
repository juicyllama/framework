import type { App, Plugin } from 'vue'
import { default as JLNotice } from './Notice.vue'
export default {
	install(Vue: App) {
		Vue.component('JLNotice', JLNotice)
	},
} as Plugin

export { JLNotice }
