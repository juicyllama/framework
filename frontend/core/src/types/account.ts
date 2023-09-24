import type { Role } from './role'
import type { AuthFormState } from '../helpers/validators'
import type { User } from './user'

export interface CreateAccount extends AuthFormState {
	account_name: string
	first_name: string
	last_name: string
}

export interface NewAccountDetails {
	account: Account
	owner: User
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
	roles?: Role[]
	avatar_image_url?: string
	onboarding_step?: number
	onboarding_completed?: boolean
}
