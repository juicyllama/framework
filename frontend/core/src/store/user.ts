import { Router, RouteLocationNormalizedLoaded } from 'vue-router'
import { defineStore } from 'pinia'
import type { User, UserLogin } from '../types'
import { UserPreferences } from '../types'
import {
	accountAuthCheck,
	getUser,
	loginUser,
	passwordlessLogin,
	passwordlessLoginCode,
	resetPassword,
	resetPasswordCode,
	resetPasswordComplete,
} from '../services/auth'
import { logger } from '../helpers'
import { token } from './token'
import { goToLogin } from '../helpers'
import { UsersService, USERS_ENDPOINT } from '../services/users'
import { AccountStore } from './account'
import { QVueGlobals } from 'quasar'
import { LogSeverity } from '../types'

type T = User

const usersService = new UsersService()

export const UserStore = defineStore('user', {
	state: () => ({
		user: window.localStorage.getItem('user') ? <User>JSON.parse(window.localStorage.getItem('user')) : null,
		preferences: window.localStorage.getItem('user_preferences')
			? <UserPreferences>JSON.parse(window.localStorage.getItem('user_preferences'))
			: null,
	}),
	actions: {
		async setUser(user: T): Promise<T> {
			window.localStorage.setItem('user', JSON.stringify(user))
			this.$state.user = user
			return user
		},

		setPreference(object: Partial<UserPreferences>): UserPreferences {
			const merged: UserPreferences = {
				...this.$state.preferences,
				...object,
			}

			window.localStorage.setItem('user_preferences', JSON.stringify(merged))
			this.$state.preferences = merged
			return merged
		},

		async login(data: UserLogin, q?: QVueGlobals, router?: Router): Promise<User> {
			try {
				const access_token = await loginUser(data, q, router)
				if(!access_token) return
				return await this.processAccessToken(access_token, q)
			} catch (e: any) {
				logger({ severity: LogSeverity.ERROR, message: e.message, q: q })
			}
		},

		async passwordlss(email: string): Promise<boolean> {
			try {
				await passwordlessLogin(email)
				return true
			} catch (e: any) {
				logger({ severity: LogSeverity.ERROR, message: e.message })
				return false
			}
		},

		async passwordlssCode(email: string, code: string, q?: QVueGlobals): Promise<T> {
			try {
				const access_token = await passwordlessLoginCode(email, code)
				return await this.processAccessToken(access_token, q)
			} catch (e: any) {
				logger({ severity: LogSeverity.ERROR, message: e.message })
			}
		},

		async reset(email: string): Promise<boolean> {
			try {
				await resetPassword(email)
				return true
			} catch (e: any) {
				logger({ severity: LogSeverity.ERROR, message: e.message })
				return false
			}
		},

		async resetCode(email: string, code: string): Promise<boolean> {
			try {
				await resetPasswordCode(email, code)
				return true
			} catch (e: any) {
				logger({ severity: LogSeverity.ERROR, message: e.message })
				return false
			}
		},

		async resetComplete(email: string, code: string, password: string, q?: QVueGlobals): Promise<T> {
			console.log(email, code, password)
				const access_token = await resetPasswordComplete(email, code, password)
				return await this.processAccessToken(access_token, q)
		},

		async getUser(): Promise<T> {
			const userData = await getUser()
			return await this.setUser(userData)
		},

		isAdmin(router: Router, route: RouteLocationNormalizedLoaded, account_id?: number): boolean {
			if (!account_id) {
				const accountStore = AccountStore()
				account_id = accountStore.getAccountId
			}

			if (!this.$state.user) {

				if(route.fullPath) {
					router.push(`/login?r=${route.fullPath}`)
				}else{
					this.logout(router, '/login')
				}				
				return false
			}

			const roles = this.$state.user.roles

			if (!roles) {
				this.logout(router, '/login')
				return false
			}

			const role = roles.find(role => {
				if (role.account_id === account_id) return role
			})

			return ['ADMIN', 'OWNER'].includes(role.role)
		},

		async updateOwnProfile(data: Partial<User>, q?: QVueGlobals): Promise<T> {
			try {
				const user = await usersService.update({
					url: USERS_ENDPOINT,
					record_id: this.$state.user.user_id,
					data: data,
				})
				if (user) {
					logger({ severity: LogSeverity.LOG, message: 'Profile updated successfully', q: q })
					await this.setUser({
						...this.$state.user,
						...data,
					})
					return user
				}
			} catch (e: any) {
				logger({ severity: LogSeverity.ERROR, message: e.message })
			}
		},

		async updateOwnAvatar(file: any, q?: QVueGlobals): Promise<T> {
			try {
				const user = await usersService.updateUserAvatar(this.$state.user.user_id, file)
				if (user?.avatar_image_url) {
					logger({ severity: LogSeverity.LOG, message: 'Avatar updated successfully', q: q })
					await this.setUser({
						...this.$state.user,
						avatar_image_url: user.avatar_image_url,
						avatar_type: user.avatar_type,
					})
					return user
				}
			} catch (e: any) {
				logger({ severity: LogSeverity.ERROR, message: e.message })
			}
		},

		async logout(router?: Router, redirect?: string) {
			logger({ severity: LogSeverity.VERBOSE, message: `[Store][User][Logout] Logout User` })
			window.localStorage.removeItem('user')
			this.$state.user = null
			await token.remove()

			if(!router) {
				if(redirect){
					window.location.href = redirect
				}else{
					window.location.href = '/'
				}
			}

			await goToLogin(router, redirect)
		},

		async processAccessToken(access_token: string, q?: QVueGlobals): Promise<T> {
			await token.set(access_token)
			const user = await getUser()

			if (!user?.user_id) {
				logger({ severity: LogSeverity.ERROR, message: `Authentication Error`, q: q })
				return
			}

			logger({ severity: LogSeverity.VERBOSE, message: `User logged in, setting account` })

			const accountStore = AccountStore()

			if (
				!accountStore.getAccountId ||
				!user.accounts.map(accounts => accounts.account_id).includes(accountStore.getAccountId)
			) {
				await accountStore.setAccountByUser(user)
			}

			logger({ severity: LogSeverity.LOG, message: `Login Successful`, q: q })

			await this.setUser(user)

			return user
		},

		async accountCheck(router: Router, redirect: string) {
			if (!accountAuthCheck) {
				logger({ severity: LogSeverity.VERBOSE, message: `[Store][User][AccountCheck] Failed` })
				await this.logout(router, redirect)
			}
		},
	},
	getters: {
		getUser(state): User {
			return state.user ?? null
		},
	}
})
