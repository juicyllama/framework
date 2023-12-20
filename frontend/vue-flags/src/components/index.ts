import type { App, Plugin } from 'vue'
import { default as Flag } from './Flag.vue'
export default {
	install(Vue: App) {
		Vue.component('Flag', Flag)
	},
} as Plugin

export { Flag }
