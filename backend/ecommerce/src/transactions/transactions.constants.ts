import { Transaction } from './transactions.entity'

export const TRANSACTION_E = Transaction
export type TRANSACTION_T = Transaction
export const TRANSACTION_PRIMARY_KEY = 'transaction_id'
export const TRANSACTION_NAME = 'transaction'
export const TRANSACTION_SEARCH_FIELDS = ['order_id', 'order_number']
export const TRANSACTION_DEFAULT_ORDER_BY = 'created_at'
