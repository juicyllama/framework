import { Account } from "../account"
import { Contact, ContactAddress } from "../crm"
import { EcommerceStore } from "./stores"

export enum TransactionDiscountType {
    FIXED = 'FIXED',
	PERCENTAGE = 'PERCENTAGE',
	SHIPPING = 'SHIPPING',
}

export interface TransactionDiscount {
    account: Account
    account_id: number
    amount: number
    code: string
    type: TransactionDiscountType
}

export enum TransactionPaymentStatus {
    PENDING = 'PENDING',
	AURHORIZED = 'AURHORIZED',
	PARTPAID = 'PARTPAID',
	PAID = 'PAID',
	REFUNDED = 'REFUNDED',
	PATRIALREFUND = 'PATRIALREFUND',
	CANCELLED = 'CANCELLED',
	CHARGEDBACK = 'CHARGEDBACK',
}

export enum TransactionFulfillmentStatus {
	PENDING = 'PENDING',
	PROCESSING = 'PROCESSING',
	PARTIALLY_SHIPPED = 'PARTIALLY_SHIPPED',
	SHIPPED = 'SHIPPED',
	DELIVERED = 'DELIVERED',
	CANCELLED = 'CANCELLED',
	RETURNED = 'RETURNED',
	EXCHANGED = 'EXCHANGED',
}

export interface EcommerceTransaction {
    account: Account
    account_id: number
    store: EcommerceStore
    store_id: number
    order_id: string
    order_number?: string
    contact?: Contact
    contact_id?: number
    shipping_address?: ContactAddress
    shipping_address_id?: number
    billing_address?: ContactAddress
    billing_address_id?: number
    payment_status: TransactionPaymentStatus
    fulfillment_status: TransactionFulfillmentStatus
    currency: string
    subtotal_price: number
    total_shipping?: number
    total_discounts?: number
    total_tax: number
    total_outstanding?: number
    total_price: number	
    discounts?: TransactionDiscount[]
    test?: boolean
    cancelled_at?: Date
    cancel_reason?: string
    refunded_at?: Date
    created_at?: Date
    updated_at?: Date
}
