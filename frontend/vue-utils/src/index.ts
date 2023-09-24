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
export * from './types/index'
export * from './utils/Strings'
export * from './utils/Color'
export * from './utils/Dates'
export * from './utils/Enums'
export * from './utils/Numbers'

export * from './enums/currencies'
export * from './enums/dates'
export * from './enums/stats'