import type { App, Plugin } from 'vue'
import { default as JLAppStore } from './AppStore.vue'
import { default as JLAppStoreConnect } from './Connect.vue'
import { default as JLOauthStart } from './oauth/Start.vue'

export default {
	install(Vue: App) {
		Vue.component('JLAppStore', JLAppStore),
		Vue.component('JLAppStoreConnect', JLAppStoreConnect),
		Vue.component('JLOauthStart', JLOauthStart)
	},
} as Plugin

export { JLAppStore, JLAppStoreConnect, JLOauthStart }
