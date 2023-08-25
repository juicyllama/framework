import { defineStore } from 'pinia'
import type { User, UserLogin } from '@/types'
import { logger } from '@/helpers/logger'
import { createAccount, getAccount, updateAccount, updateAccountAvatar } from '@/services/account'
import type { Account, CreateAccount } from '@/types'
import { UserStore } from './user'
import { LogSeverity } from '@/types'
import { QVueGlobals } from 'quasar'
import { getUser } from '@/services/auth'

export const AccountStore = defineStore('account', {
	state: () => ({
		selected_account: window.localStorage.getItem('selected_account')
			? <Account>JSON.parse(window.localStorage.getItem('selected_account'))
			: null,
	}),
	actions: {
		async setAccountByUser(user?: User): Promise<void> {
			if (!user) {
				user = await getUser()
			}

			this.setSelectedAccount(user.accounts[0])
		},
		async create(data: CreateAccount): Promise<User> {
			const userStore = UserStore()
			try {
				const result = await createAccount(data)
				if (result?.account?.account_id) {
					this.setSelectedAccount(result.account)
					return await userStore.login(<UserLogin>{ email: data.email, password: data.password.value })
				}
			} catch (e: any) {
				logger({ severity: LogSeverity.ERROR, message: e.message })
			}
		},
		async resyncAccount(account_id: number): Promise<Account> {
			const result = await getAccount(account_id)
			if (result?.account_id) {
				this.setSelectedAccount(result)
				return result
			}
		},
		setSelectedAccount(account: Account): void {
			this.$state.selected_account = account
			window.localStorage.setItem('selected_account', JSON.stringify(account))
		},
		unsetSelectedAccount(): void {
			this.$state.selected_account = null
			window.localStorage.removeItem('selected_account')
		},
		async update(data: Partial<Account>, q?: QVueGlobals): Promise<Account> {
			try {
				const account = await updateAccount(this.$state.selected_account.account_id, data)
				if (account) {
					logger({ severity: LogSeverity.LOG, message: 'Account updated successfully', q: q })
					this.setSelectedAccount(account)
					return account
				}
			} catch (e: any) {
				logger({ severity: LogSeverity.ERROR, message: e.message })
			}
		},
		async updateAvatar(file: any, q?: QVueGlobals): Promise<Account> {
			try {
				const account = await updateAccountAvatar(await this.getAccountId, file)
				if (account?.avatar_image_url) {
					logger({ severity: LogSeverity.LOG, message: 'Avatar updated successfully', q: q })
					this.setSelectedAccount({
						...this.$state.selected_account,
						avatar_image_url: account.avatar_image_url,
					})
					return account
				}
			} catch (e: any) {
				logger({ severity: LogSeverity.ERROR, message: e.message })
			}
		},
	},
	getters: {
		getAccountId(state): number {
			return state.selected_account?.account_id ?? null
		},
		async getAccountName(state): Promise<string> {
			if (!state.selected_account?.account_id) {
				if (!state.selected_account?.account_id) {
					await this.setDefaultAccount()
					return state.selected_account.account_name
				}
			}
			return state.selected_account.account_name
		},
		async getOnboardingStep(state: any): Promise<number> {
			if (!state.selected_account?.account_id) {
				if (!state.selected_account?.account_id) {
					await this.setDefaultAccount()
					return state.selected_account.onboarding_step
				}
			}
			return state.selected_account.onboarding_step
		},
	},
})
