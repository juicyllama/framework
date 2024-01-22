import { InstalledApp } from '@juicyllama/app-store'
import {
	ContactsService,
	ContactEmailService,
	ContactAddressService,
	ContactPhoneService,
	Contact,
	ContactAddress,
} from '@juicyllama/crm'
import {
	Store,
	Transaction,
	TransactionDiscount,
	TransactionDiscountsService,
	TransactionDiscountType,
	TransactionFulfillmentStatus,
	TransactionPaymentStatus,
	TransactionsService,
	UpdateTransactionDto,
} from '@juicyllama/ecommerce'
import { Injectable } from '@nestjs/common'
import { ShopifyOrder, ShopifyOrderDiscountCodes } from './orders.dto'
import { ShopifyOrderDicountCodeType, ShopifyOrderFinancialStatus, ShopifyOrderFulfillmentStatus } from './orders.enums'

@Injectable()
export class ShopifyOrdersMapperService {
	constructor(
		private readonly contactsService: ContactsService,
		private readonly contactEmailService: ContactEmailService,
		private readonly contactAddressService: ContactAddressService,
		private readonly contactPhoneService: ContactPhoneService,
		private readonly transactionsService: TransactionsService,
		private readonly transactionsDiscountService: TransactionDiscountsService,
	) {}

	async createEcommerceTransaction(
		order: ShopifyOrder,
		store: Store,
		installed_app: InstalledApp,
	): Promise<Transaction> {
		let contact: Contact
		let shipping_address: ContactAddress
		let billing_address: ContactAddress

		if (!order.email) {
			order.email = `${order.id}@${installed_app.settings.SHOPIFY_SHOP_NAME}.myshopify.com`
		}

		contact = await this.contactsService.findByEmail(order.email)

		if (!contact) {
			contact = await this.contactsService.create({
				account_id: store.account_id,
				first_name: order.customer?.first_name,
				last_name: order.customer?.last_name,
			})
		}

		await this.contactEmailService.create({
			contact_id: contact.contact_id,
			email: order.email,
		})

		if (order.billing_address?.phone) {
			await this.contactPhoneService.create({
				contact_id: contact.contact_id,
				number: order.billing_address.phone,
				country_iso: order.billing_address.country_code,
			})
		}

		if (order.shipping_address?.phone) {
			await this.contactPhoneService.create({
				contact_id: contact.contact_id,
				number: order.shipping_address.phone,
				country_iso: order.shipping_address.country_code,
			})
		}

		if (order.shipping_address) {
			shipping_address = await this.contactAddressService.create({
				contact_id: contact.contact_id,
				address_1: order.shipping_address.address1,
				address_2: order.shipping_address.address2,
				city: order.shipping_address.city,
				state: order.shipping_address.province,
				post_code: order.shipping_address.zip,
				country_iso: order.shipping_address.country_code,
				latitude: order.shipping_address.latitude,
				longitude: order.shipping_address.longitude,
			})
		}

		if (order.billing_address) {
			billing_address = await this.contactAddressService.create({
				contact_id: contact.contact_id,
				address_1: order.billing_address.address1,
				address_2: order.billing_address.address2,
				city: order.billing_address.city,
				state: order.billing_address.province,
				post_code: order.billing_address.zip,
				country_iso: order.billing_address.country_code,
				latitude: order.billing_address.latitude,
				longitude: order.billing_address.longitude,
			})
		}

		const transaction = await this.transactionsService.create({
			account_id: store.account_id,
			store_id: store.store_id,
			installed_app_id: installed_app.installed_app_id,
			order_id: order.id.toString(),
			order_number: order.order_number.toString(),
			contact_id: contact?.contact_id,
			shipping_address_id: shipping_address?.address_id,
			billing_address_id: billing_address?.address_id,
			payment_status: this.shopifyOrderFinancialStatusToEcommerceTransactionStatus(order.financial_status),
			fulfillment_status: this.shopifyOrderFulfillmentStatusToEcommerceTransactionStatus(
				order.fulfillment_status,
			),
			currency: order.currency,
			subtotal_price: order.subtotal_price,
			total_shipping: Number(order.total_shipping_price_set?.shop_money?.amount),
			total_discounts: order.total_discounts,
			total_tax: order.total_tax,
			total_outstanding: order.total_outstanding,
			total_price: order.total_price,
			test: order.test,
			cancelled_at: order.cancelled_at,
			cancel_reason: order.cancel_reason,
			created_at: order.created_at,
		})

		transaction.contact = contact
		transaction.shipping_address = shipping_address
		transaction.billing_address = billing_address
		transaction.discounts = await this.shopifyDiscountCodesToEcommerceDicounts(
			order.discount_codes,
			store.account_id,
			transaction.transaction_id,
		)

		return transaction
	}

	async updateEcommerceTransaction(transaction: Transaction, order: ShopifyOrder): Promise<Transaction> {
		let has_changed = false
		const changed: UpdateTransactionDto = {}

		const newPaymentStatus = this.shopifyOrderFinancialStatusToEcommerceTransactionStatus(order.financial_status)
		if (transaction.payment_status !== newPaymentStatus) {
			changed.payment_status = newPaymentStatus
			has_changed = true
		}

		const newFulfillmentStatus = this.shopifyOrderFulfillmentStatusToEcommerceTransactionStatus(
			order.fulfillment_status,
		)
		if (transaction.fulfillment_status !== newFulfillmentStatus) {
			changed.fulfillment_status = newFulfillmentStatus
			has_changed = true
		}
		const orderTotal = Number(order.total_shipping_price_set?.shop_money?.amount ?? '0')
		if (order.total_shipping_price_set?.shop_money?.amount && Number(transaction.total_shipping) !== orderTotal) {
			changed.total_shipping = orderTotal
			has_changed = true
		}

		if (transaction.subtotal_price !== order.subtotal_price) {
			changed.subtotal_price = order.subtotal_price
			has_changed = true
		}

		if (transaction.total_discounts !== order.total_discounts) {
			changed.total_discounts = order.total_discounts
			has_changed = true
		}

		if (transaction.total_tax !== order.total_tax) {
			changed.total_tax = order.total_tax
			has_changed = true
		}

		if (transaction.total_outstanding !== order.total_outstanding) {
			changed.total_outstanding = order.total_outstanding
			has_changed = true
		}

		if (transaction.total_price !== order.total_price) {
			changed.total_price = order.total_price
			has_changed = true
		}

		if (transaction.cancelled_at !== order.cancelled_at) {
			changed.cancelled_at = order.cancelled_at
			has_changed = true
		}

		if (transaction.cancel_reason !== order.cancel_reason) {
			changed.cancel_reason = order.cancel_reason
			has_changed = true
		}

		if (has_changed) {
			return await this.transactionsService.update({
				transaction_id: transaction.transaction_id,
				...changed,
			})
		} else {
			return transaction
		}
	}

	shopifyOrderFinancialStatusToEcommerceTransactionStatus(
		status: ShopifyOrderFinancialStatus,
	): TransactionPaymentStatus {
		switch (status) {
			case ShopifyOrderFinancialStatus.pending:
				return TransactionPaymentStatus.PENDING
			case ShopifyOrderFinancialStatus.authorized:
				return TransactionPaymentStatus.AURHORIZED
			case ShopifyOrderFinancialStatus.partially_paid:
				return TransactionPaymentStatus.PARTPAID
			case ShopifyOrderFinancialStatus.paid:
				return TransactionPaymentStatus.PAID
			case ShopifyOrderFinancialStatus.partially_refunded:
				return TransactionPaymentStatus.PATRIALREFUND
			case ShopifyOrderFinancialStatus.refunded:
				return TransactionPaymentStatus.REFUNDED
			case ShopifyOrderFinancialStatus.voided:
				return TransactionPaymentStatus.CANCELLED
		}
	}

	shopifyOrderFulfillmentStatusToEcommerceTransactionStatus(
		status: ShopifyOrderFulfillmentStatus,
	): TransactionFulfillmentStatus {
		switch (status) {
			case ShopifyOrderFulfillmentStatus.fulfilled:
				return TransactionFulfillmentStatus.SHIPPED
			case ShopifyOrderFulfillmentStatus.partial:
				return TransactionFulfillmentStatus.PARTIALLY_SHIPPED
			case ShopifyOrderFulfillmentStatus.restocked:
				return TransactionFulfillmentStatus.RETURNED
			case ShopifyOrderFulfillmentStatus.null:
				return TransactionFulfillmentStatus.PENDING
		}
	}

	async shopifyDiscountCodesToEcommerceDicounts(
		discounts: ShopifyOrderDiscountCodes[],
		account_id: number,
		transaction_id: number,
	): Promise<TransactionDiscount[]> {
		const transactionDiscounts: TransactionDiscount[] = []
		for (const discount of discounts) {
			let discount_type = TransactionDiscountType.FIXED

			switch (discount.type) {
				case ShopifyOrderDicountCodeType.fixed_amount:
					discount_type = TransactionDiscountType.FIXED
					break
				case ShopifyOrderDicountCodeType.percentage:
					discount_type = TransactionDiscountType.PERCENTAGE
					break
				case ShopifyOrderDicountCodeType.shipping:
					discount_type = TransactionDiscountType.SHIPPING
					break
			}

			transactionDiscounts.push(
				await this.transactionsDiscountService.create({
					account_id: account_id,
					transaction_id: transaction_id,
					code: discount.code,
					type: discount_type,
					amount: Number(discount.amount),
				}),
			)
		}

		return transactionDiscounts
	}
}
