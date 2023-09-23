import type { App, Plugin } from 'vue'
import { default as JLLogin } from './Login.vue'
import JLSignup from './Signup.vue'
import JLPasswordless from './Passwordless.vue'
import JLResetPassword from './Reset.vue'
export default {
	install(Vue: App) {
		Vue.component('JLLogin', JLLogin)
		Vue.component('JLSignup', JLSignup)
		Vue.component('JLPasswordless', JLPasswordless)
		Vue.component('JLResetPassword', JLResetPassword)
	},
} as Plugin

export { JLLogin, JLSignup, JLPasswordless, JLResetPassword }
