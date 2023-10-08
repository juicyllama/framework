import { TransactionDiscount } from "./discounts.entity"

export const TRANSACTION_DISCOUNT_E = TransactionDiscount
export type TRANSACTION_DISCOUNT_T = TransactionDiscount
export const TRANSACTION_DISCOUNT_PRIMARY_KEY = 'transaction_discount_id'
export const TRANSACTION_DISCOUNT_NAME = 'discounts'
export const TRANSACTION_DISCOUNT_SEARCH_FIELDS = ['code']
export const TRANSACTION_DISCOUNT_DEFAULT_ORDER_BY = 'created_at'