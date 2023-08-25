import { App } from 'vue'

import * as components from './components'
export * from './styles/index.scss'

const JLUtils = {
	install(app: App) {
		// Auto import all components
		for (const componentKey in components) {
			app.use((components as any)[componentKey])
		}
	},
}

export { JLUtils }

// export all components as vue plugin
export * from './components'
