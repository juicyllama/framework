import { defineStore } from 'pinia'

export const ThemeStore = defineStore('theme', {
	state: () => ({
		left_draw: window.localStorage.getItem('theme_left_draw')
			? <boolean>JSON.parse(window.localStorage.getItem('theme_left_draw'))
			: true,
	}),
	actions: {
		setLeftDraw(boolean: boolean): boolean {
			window.localStorage.setItem('theme_left_draw', JSON.stringify(boolean))
			this.$state.left_draw = boolean
			return boolean
		},
	},
})
