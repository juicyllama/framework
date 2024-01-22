import type { App } from 'vue'
import { AccountStore } from './store/account'
import { token } from './store/token'
import { UserStore } from './store/user'
import { WebsitesStore } from './store/websites'
import { SettingsStore } from './store/settings'
import instance from './services/index'
import classes from './assets/JLCore.module.css'
import { ThemeStore } from './store/theme'
import { JLLogin, JLSignup, JLPasswordless, JLResetPassword, OTP } from './components/core/auth'
import {
	JLForm,
	JLTable,
	JLMenu,
	JLChart,
	JLStats,
	JLDropdownButtonMenu,
	WidgetsComponent,
	JLUsersTable,
	JLUpload,
	JLBillingPage,
	JLInvoicePage,
} from './components'
import { JLAccountProfile, JLAccountAvatar, JLAccountSwitcher, JLAccountBrand } from './components/core/account'
import { JLUserAvatar, JLUserProfile, JLUserMenu } from './components/core/user'
import { JLAppStoreConnect, JLOauthStart } from './components/app-store'
import { Plugin } from 'vue'

import '@quasar/extras/material-icons/material-icons.css'

let userStore
let accountStore
let themeStore
let settingsStore
let websitesStore

const JLCore = {
	install(app: App, options: any) {
		const { $pinia } = options

		if (!$pinia) {
			throw new Error(`No active Pinia instance was passed to your package`)
		}

		userStore = UserStore($pinia)
		accountStore = AccountStore($pinia)
		themeStore = ThemeStore($pinia)
		settingsStore = SettingsStore($pinia)
		websitesStore = WebsitesStore($pinia)
	},
}

export default {
	install(Vue: App) {
		Vue.component('JLSignup', JLSignup)
		Vue.component('JLPasswordless', JLPasswordless)
		Vue.component('JLResetPassword', JLResetPassword)
		Vue.component('JLLogin', JLLogin)
		Vue.component('OTP', OTP)
		Vue.component('JLForm', JLForm)
		Vue.component('JLTable', JLTable)
		Vue.component('JLUpload', JLUpload)
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
		Vue.component('JLUsersTable', JLUsersTable)
		Vue.component('JLAppStoreConnect', JLAppStoreConnect)
		Vue.component('JLOauthStart', JLOauthStart)
		Vue.component('JLBillingPage', JLBillingPage)
		Vue.component('JLInvoicePage', JLInvoicePage)
	},
} as Plugin

export { JLCore, classes }
export { token }
export { userStore, accountStore, themeStore, settingsStore, websitesStore }
export * from './components'
export * from './types/index'
export { instance }
export * from './helpers/index'
export * from './plugins/index'
export * from './services/index.exports'
export {
	JLLogin,
	JLSignup,
	JLPasswordless,
	JLResetPassword,
	JLAccountProfile,
	JLAccountAvatar,
	JLAccountSwitcher,
	JLAccountBrand,
	JLForm,
	JLTable,
	JLUserAvatar,
	JLUserProfile,
	JLUserMenu,
	JLAppStoreConnect,
	JLOauthStart,
	JLMenu,
	JLDropdownButtonMenu,
	JLStats,
	JLChart,
	JLUpload,
	WidgetsComponent,
	JLUsersTable,
	JLBillingPage,
	JLInvoicePage,
	OTP
}
