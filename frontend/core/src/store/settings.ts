import { defineStore } from 'pinia'
import type { Settings } from '@/types'

type T = Settings

export const SettingsStore = defineStore('settings', {
	state: () => (window.localStorage.getItem('settings') ? <Settings>JSON.parse(window.localStorage.getItem('settings')) : null),
	actions: {
		setSettings(object: Partial<Settings>): Settings {
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
		getSettings(): Settings {
			return this.$state
		},
	}
})
