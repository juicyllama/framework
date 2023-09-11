import type { App, Plugin } from 'vue'
import BillingPage from './BillingPage.vue'
import InvoicePage from './InvoicePage.vue'

export default {
	install(Vue: App) {
		Vue.component('JLBillingPage', BillingPage)
		Vue.component('JLInvoicePage', InvoicePage)
	},
} as Plugin

export { BillingPage, InvoicePage }
