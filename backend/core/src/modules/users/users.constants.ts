import { ControllerConstants } from '../../types/common'
import { User } from './users.entity'
import { UserOrderBy, UserRelations, UserSelect } from './users.enums'
import { CreateUserDto, UpdateUserDto, UserDto, UserResponeDto } from './users.dto'

export const E = User
export type T = User
export const NAME: string = 'user'
export const SEARCH_FIELDS: string[] = ['first_name', 'last_name', 'email']
export const DEFAULT_ORDER_BY: string = 'first_name'
export const PRIMARY_KEY: string = 'user_id'
export const UPLOAD_FIELDS: string[] = ['first_name', 'last_name', 'email']
export const UPLOAD_DUPLICATE_FIELD: string = 'email'

export const usersConstants: ControllerConstants = {
	entity: E,
	name: NAME,
	primaryKey: PRIMARY_KEY,
	searchFields: SEARCH_FIELDS,
	defaultOrderBy: DEFAULT_ORDER_BY,
	selectEnum: UserSelect,
	orderByEnum: UserOrderBy,
	relationsEnum: UserRelations,
	dtos: {
		base: UserDto,
		create: CreateUserDto,
		update: UpdateUserDto,
		response: UserResponeDto,
	},
}
