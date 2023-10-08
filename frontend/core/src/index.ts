import type { App } from 'vue'
import { AccountStore } from './store/account'
import { token } from './store/token'
import { UserStore } from './store/user'
import instance from './services/index'
import classes from './assets/JLCore.css'
import { ThemeStore } from './store/theme'
import { JLForm, JLTable, JLMenu, JLChart, JLStats, JLLogin, JLDropdownButtonMenu, WidgetsComponent } from '@/components'
import { JLAccountProfile, JLAccountAvatar, JLAccountSwitcher, JLAccountBrand } from '@/components/core/account'
import { JLUserAvatar, JLUserProfile, JLUserMenu } from '@/components/core/user'
import { JLAppStoreConnect } from '@/components/app-store'
import { Plugin } from 'vue'

let userStore
let accountStore
let themeStore

const JLCore = {
	install(app: App, options: any) {
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
export * from './components'
export * from './types/index'
export { instance }
export * from './plugins/index'
export * from './helpers/index'
export * from './services/app-store/index'
export * from './services/crm/index'
export * from './services/tools/index'
export * from './services/account'
export * from './services/auth'
export * from './services/billing'
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
	WidgetsComponent,
}
