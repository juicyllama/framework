import { Charge } from './charges.entity'
import { ControllerConstants } from '@juicyllama/core'
import { ChargeOrderBy, ChargeRelations, ChargeSelect } from './charges.enums'

export const BILLING_CHARGES_NAME = 'charge'
export const BILLING_CHARGES_PRIMARY_KEY = 'charge_id'
export const BILLING_CHARGES_CURRENCY_FIELD = 'currency'
export const BILLING_CHARGES_CURRENCY_FIELDS = ['amount_subtotal', 'amount_tax', 'amount_total']
export const BILLING_CHARGES_SEARCH_FIELDS = ['name', 'description']
export const BILLING_CHARGES_ORDER_BY = 'charge_id'

export const BILLING_CHARGES_E = Charge
export type BILLING_CHARGES_T = Charge

export const billingChargesConstants: ControllerConstants = {
	entity: BILLING_CHARGES_E,
	name: BILLING_CHARGES_NAME,
	primaryKey: BILLING_CHARGES_PRIMARY_KEY,
	searchFields: BILLING_CHARGES_SEARCH_FIELDS,
	defaultOrderBy: BILLING_CHARGES_ORDER_BY,
	currencyField: BILLING_CHARGES_CURRENCY_FIELD,
	currencyFields: BILLING_CHARGES_CURRENCY_FIELDS,
	selectEnum: ChargeSelect,
	orderByEnum: ChargeOrderBy,
	relationsEnum: ChargeRelations,
}
