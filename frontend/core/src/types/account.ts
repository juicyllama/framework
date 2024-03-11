import type { AuthFormState } from '../helpers/validators'
import type { User } from './user'
import { UserAccount } from './user-account'

export interface CreateAccount extends AuthFormState {
	account_name?: string
	first_name?: string
	last_name?: string
}

export interface NewAccountDetails {
	account: Account
	owner: User
	access_token: string
}

export interface Account {
	readonly account_id: number
	account_name: string
	currency: string
	company_name?: string
	address_1?: string
	address_2?: string
	city?: string
	postcode?: string
	state?: string
	country?: string
	finance_email?: string
	customer_service_email?: string
	customer_service_name?: string
	readonly created_at: Date
	updated_at: Date
	user_accounts?: UserAccount[]
	avatar_image_url?: string
	onboarding_step?: number
	onboarding_completed?: boolean
}
