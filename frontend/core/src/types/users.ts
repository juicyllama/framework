import { AvatarOptions, IconSettings } from '../types/common'

export enum UserSelect {
	user_id = 'user_id',
	first_name = 'first_name',
	last_name = 'last_name',
	email = 'email',
	created_at = 'created_at',
	last_login = 'last_login',
}

export enum UserOrderBy {
	user_id = 'user_id',
	first_name = 'first_name',
	last_name = 'last_name',
	email = 'email',
	created_at = 'created_at',
	last_login = 'last_login',
}

export enum UserRelations {
	accounts = 'accounts',
	roles = 'roles',
}

export interface UserMenuOptions {
	icon?: IconSettings
	avatar?: AvatarOptions
	show?: {
		profile?: boolean
		billing?: boolean
		admin?: boolean
	}
}

export interface UserAvatarOptions {
	avatar?: AvatarOptions
	clickToMenu?: boolean
	clickToEdit?: boolean
	menu?: UserMenuOptions
}
