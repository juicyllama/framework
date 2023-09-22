import instance from '../services'

export const token = {
	get(): string | null {
		return window.localStorage.getItem('token')
	},
	set(token: string): void {
		window.localStorage.setItem('token', token)
		instance.defaults.headers.common['Authorization'] = 'Bearer ' + token
	},
	remove(): void {
		window.localStorage.removeItem('token')
		delete instance?.defaults?.headers?.common['Authorization']
	},
}
