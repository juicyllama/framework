import type { App, Plugin } from 'vue'
import JLUserAvatar from './UserAvatar.vue'
import JLUserMenu from './UserMenu.vue'
import JLUserProfile from './UserProfile.vue'

export default {
	install(Vue: App) {
		Vue.component('JLUserAvatar', JLUserAvatar)
		Vue.component('JLUserMenu', JLUserMenu)
		Vue.component('JLUserProfile', JLUserProfile)
	},
} as Plugin

export { default as JLUserAvatar } from './UserAvatar.vue'
export { default as JLUserMenu } from './UserMenu.vue'
export { default as JLUserProfile } from './UserProfile.vue'
