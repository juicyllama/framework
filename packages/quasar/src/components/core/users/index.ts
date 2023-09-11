import type { App, Plugin } from 'vue'
import { default as JLUsersTable } from './usersTable.vue'

export default {
	install(Vue: App) {
		Vue.component('JLUsersTable', JLUsersTable)
	},
} as Plugin

export { JLUsersTable }
