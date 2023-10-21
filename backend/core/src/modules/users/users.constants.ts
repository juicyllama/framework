import { User } from './users.entity'

export const E = User
export type T = User
export const NAME: string = 'user'
export const SEARCH_FIELDS: string[] = ['first_name', 'last_name', 'email']
export const DEFAULT_ORDER_BY: string = 'first_name'
export const PRIMARY_KEY: string = 'user_id'
export const UPLOAD_FIELDS: string[] = ['first_name', 'last_name', 'email']
export const UPLOAD_DUPLICATE_FIELD: string = 'email'
