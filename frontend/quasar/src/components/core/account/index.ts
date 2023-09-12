import type { App, Plugin } from 'vue'
import { default as JLAccountProfile } from './AccountProfile.vue'
import { default as JLAccountAvatar } from './AccountAvatar.vue'
import { default as JLAccountSwitcher } from './AccountSwitcher.vue'
import { default as JLAccountBrand } from './AccountBrand.vue'

export default {
	install(Vue: App) {
		Vue.component('JLAccountSwitcher', JLAccountSwitcher)
		Vue.component('JLAccountBrand', JLAccountBrand)
		Vue.component('JLAccountProfile', JLAccountProfile)
		Vue.component('JLAccountAvatar', JLAccountAvatar)
	},
} as Plugin

export { JLAccountProfile, JLAccountAvatar, JLAccountSwitcher, JLAccountBrand }
