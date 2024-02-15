import { Json } from '@juicyllama/vue-utils'
import { defineStore } from 'pinia'

export const ThemeStore = defineStore('theme', {
	state: () => ({
		left_draw: Json.getLocalStorageObject<boolean>('theme_left_draw') ?? true
	}),
	actions: {
		setLeftDraw(boolean: boolean): boolean {
			window.localStorage.setItem('theme_left_draw', JSON.stringify(boolean))
			this.$state.left_draw = boolean
			return boolean
		},
	},
})
