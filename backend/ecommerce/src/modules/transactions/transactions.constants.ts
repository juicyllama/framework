import { ControllerConstants } from '@juicyllama/core'
import { Transaction } from './transactions.entity'
import { TransactionSelect, TransactionOrderBy, TransactionRelations } from './transactions.enums'
import { CreateTransactionDto, TransactionDto, UpdateTransactionDto, TransactionResponeDto } from './transactions.dto'

export const TRANSACTION_E = Transaction
export type TRANSACTION_T = Transaction
export const TRANSACTION_PRIMARY_KEY = 'transaction_id'
export const TRANSACTION_NAME = 'transaction'
export const TRANSACTION_SEARCH_FIELDS = ['order_id', 'order_number']
export const TRANSACTION_DEFAULT_ORDER_BY = 'created_at'
export const TRANSACTION_CURRENCY_FIELD = 'currency' // the field that holds the currency e.g. 'USD'
export const TRANSACTION_CURRENCY_FIELDS = [ // the fields that hold numeric values in the currency e.g. '123.45' 
	'subtotal_price',
	'total_shipping',
	'total_discounts',
	'total_tax',
	'total_outstanding',
	'total_price',
]

export const transactionConstants: ControllerConstants = {
	entity: TRANSACTION_E,
	name: TRANSACTION_NAME,
	primaryKey: TRANSACTION_PRIMARY_KEY,
	searchFields: TRANSACTION_SEARCH_FIELDS,
	defaultOrderBy: TRANSACTION_DEFAULT_ORDER_BY,
	selectEnum: TransactionSelect,
	orderByEnum: TransactionOrderBy,
	relationsEnum: TransactionRelations,
	dtos: {
		base: TransactionDto,
		create: CreateTransactionDto,
		update: UpdateTransactionDto,
		response: TransactionResponeDto,
	},
}
