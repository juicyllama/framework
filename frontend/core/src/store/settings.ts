import { defineStore } from 'pinia'
import type { Settings } from '../types'
import { Json } from '@juicyllama/utils'

type T = Settings

export const SettingsStore = defineStore('settings', {
	state: () => Json.getLocalStorageObject<T>('settings'),
	actions: {
		setSettings(object: Partial<T>): Settings {
			const merged: Settings = {
				...this.$state,
				...object,
			}

			window.localStorage.setItem('settings', JSON.stringify(merged))
			this.$state = merged
			return merged
		},
	},
	getters: {
		getSettings(): T {
			return this.$state
		},
	},
})
