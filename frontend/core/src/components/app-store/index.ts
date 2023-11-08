import type { App, Plugin } from 'vue'
import { default as JLAppStoreConnect } from './Connect.vue'
import { default as JLOauthStart } from './oauth/Start.vue'

export default {
	install(Vue: App) {
		Vue.component('JLAppStoreConnect', JLAppStoreConnect),
		Vue.component('JLOauthStart', JLOauthStart)
	},
} as Plugin

export { JLAppStoreConnect, JLOauthStart }
