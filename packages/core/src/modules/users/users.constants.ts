import { User } from './users.entity'

export const E = User
export type T = User
export const NAME = 'user'
export const SEARCH_FIELDS = ['first_name', 'last_name', 'email']
export const DEFAULT_ORDER_BY = 'first_name'
export const PRIMARY_KEY = 'user_id'
export const CSV_FIELDS: string[] = ['first_name', 'last_name', 'email']
