import type { User } from './user'
import type { Account } from './account'
export enum UserRole {
	VIEWER_WITHOUT_REVENUE = 'VIEWER_WITHOUT_REVENUE',
	VIEWER = 'VIEWER',
	MEMBER = 'MEMBER',
	ADMIN = 'ADMIN',
	OWNER = 'OWNER',
}
export interface Role {
	readonly role_id: number
	readonly user: User
	readonly user_id: number
	readonly account: Account
	readonly account_id: number
	readonly role: UserRole
}
