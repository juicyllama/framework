import type { Account } from './account'
import { UserAccount, UserRole } from './user-account'

export enum AvatarType {
	NONE = 'NONE',
	CARTOON = 'CARTOON',
	IMAGE = 'IMAGE',
	GRAVATAR = 'GRAVATAR',
}

export interface User {
	readonly user_id: number
	accounts: Account[]
	name: string
	first_name?: string
	last_name?: string
	email: string
	password: string
	password_reset?: boolean
	avatar?: string
	readonly created_at: Date
	updated_at: Date
	last_login_at: Date
	user_accounts: UserAccount[]
	role: UserRole
	avatar_type: AvatarType
	avatar_image_url: string
}
export interface UserLogin {
	email: string
	password: string
}

export interface AddUser {
	first_name?: string
	last_name?: string
	email: string
}

export interface UserPreferencesAiFilters {
	sql: boolean
}

export interface UserPreferencesAi {
	filters?: UserPreferencesAiFilters
	question?: string
}

export interface UserPreferences {
	ai: UserPreferencesAi
}
