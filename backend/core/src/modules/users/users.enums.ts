export enum UserRole {
	VIEWER = 'VIEWER',
	MEMBER = 'MEMBER',
	ADMIN = 'ADMIN',
	OWNER = 'OWNER',
}

export enum UserRoleNum {
	VIEWER = 3,
	MEMBER = 5,
	ADMIN = 7,
	OWNER = 9,
}

export enum UserAvatarType {
	NONE = 'NONE',
	CARTOON = 'CARTOON',
	GRAVATAR = 'GRAVATAR',
	IMAGE = 'IMAGE',
}

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
	roles = 'roles',
	accounts = 'accounts',
}
