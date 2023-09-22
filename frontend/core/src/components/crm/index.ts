import type { App, Plugin } from 'vue'
import { default as JLCRMContactAvatar } from './ContactAvatar.vue'

export default {
	install(Vue: App) {
		Vue.component('JLCRMContactAvatar', JLCRMContactAvatar)
	},
} as Plugin

export { JLCRMContactAvatar }
