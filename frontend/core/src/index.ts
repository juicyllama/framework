import type { App } from 'vue'
import { AccountStore } from './store/account.js'
import { token } from './store/token.js'
import { UserStore } from './store/user.js'
import instance from './services/index.js'
import classes from './assets/JLCore.css'
import { ThemeStore } from './store/theme.js'
import { JLForm, JLTable, JLMenu, JLChart, JLStats, JLLogin, JLDropdownButtonMenu } from './components/index.js'
import {
	JLAccountProfile,
	JLAccountAvatar,
	JLAccountSwitcher,
	JLAccountBrand,
} from './components/core/account/index.js'
import { JLUserAvatar, JLUserProfile, JLUserMenu } from './components/core/user/index.js'
import { JLAppStoreConnect } from './components/app-store/index.js'
import { Plugin } from 'vue'

let userStore
let accountStore
let themeStore

const JLCore = {
	install(options: any) {
		const { $pinia } = options

		if (!$pinia) {
			throw new Error(`No active Pinia instance was passed to your package`)
		}

		userStore = UserStore($pinia)
		accountStore = AccountStore($pinia)
		themeStore = ThemeStore($pinia)
	},
}

export default {
	install(Vue: App) {
		Vue.component('JLLogin', JLLogin)
		Vue.component('JLForm', JLForm)
		Vue.component('JLTable', JLTable)
		Vue.component('JLMenu', JLMenu)
		Vue.component('JLDropdownButtonMenu', JLDropdownButtonMenu)
		Vue.component('JLChart', JLChart)
		Vue.component('JLStats', JLStats)
		Vue.component('JLAccountSwitcher', JLAccountSwitcher)
		Vue.component('JLAccountBrand', JLAccountBrand)
		Vue.component('JLAccountProfile', JLAccountProfile)
		Vue.component('JLAccountAvatar', JLAccountAvatar)
		Vue.component('JLUserAvatar', JLUserAvatar)
		Vue.component('JLUserProfile', JLUserProfile)
		Vue.component('JLUserMenu', JLUserMenu)
		Vue.component('JLAppStoreConnect', JLAppStoreConnect)
	},
} as Plugin

export { JLCore, classes }
export { token }
export { userStore, accountStore, themeStore }
export * from './components/index.js'
export * from './types/index.js'
export { instance }
export * from './plugins/index.js'
export * from './helpers/index.js'
export * from './services/app-store/index.js'
export * from './services/crm/index.js'
export * from './services/tools/index.js'
export * from './services/account.js'
export * from './services/auth.js'
export * from './services/billing.js'
export {
	JLAccountProfile,
	JLAccountAvatar,
	JLAccountSwitcher,
	JLAccountBrand,
	JLLogin,
	JLForm,
	JLTable,
	JLUserAvatar,
	JLUserProfile,
	JLUserMenu,
	JLAppStoreConnect,
	JLMenu,
	JLDropdownButtonMenu,
	JLStats,
	JLChart,
}
