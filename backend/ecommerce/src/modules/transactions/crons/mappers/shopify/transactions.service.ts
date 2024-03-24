import { Logger, Modules } from '@juicyllama/utils'
import { InstalledApp } from '@juicyllama/app-store'
import {
	ContactsService,
	ContactEmailService,
	ContactAddressService,
	ContactPhoneService,
	Contact,
	ContactAddress,
} from '@juicyllama/crm'
import { Injectable, forwardRef, Inject } from '@nestjs/common'
import { Store } from '../../../../stores/stores.entity'
import { Transaction } from '../../../transactions.entity'
import { TransactionsService } from '../../../transactions.service'
import { TransactionDiscountsService } from '../../../discounts/discounts.service'
import { TransactionItemsService } from '../../../items/items.service'
import { SkusService } from '../../../../product/skus/skus.service'
import { BundlesService } from '../../../../product/bundles/bundles.service'
import { TransactionFulfillmentStatus, TransactionPaymentStatus } from '../../../transactions.enums'
import { UpdateTransactionDto } from '../../../transactions.dto'
import { TransactionDiscount } from '../../../discounts/discounts.entity'
import { TransactionDiscountType } from '../../../discounts/discounts.enums'

@Injectable()
export class TransactionsShopifyMapperService {
	constructor(
		@Inject(forwardRef(() => ContactsService)) readonly contactsService: ContactsService,
		@Inject(forwardRef(() => ContactEmailService)) readonly contactEmailService: ContactEmailService,
		@Inject(forwardRef(() => ContactAddressService)) readonly contactAddressService: ContactAddressService,
		@Inject(forwardRef(() => ContactPhoneService)) readonly contactPhoneService: ContactPhoneService,
		@Inject(forwardRef(() => TransactionsService)) readonly transactionsService: TransactionsService,
		@Inject(forwardRef(() => TransactionDiscountsService))
		readonly transactionsDiscountService: TransactionDiscountsService,
		@Inject(forwardRef(() => TransactionItemsService)) readonly transactionItemsService: TransactionItemsService,
		@Inject(forwardRef(() => SkusService)) readonly skusService: SkusService,
		@Inject(forwardRef(() => BundlesService)) readonly bundlesService: BundlesService,
		@Inject(forwardRef(() => Logger)) readonly logger: Logger,
	) {}

	async pushTransaction(order: any, store: Store, installed_app: InstalledApp) {
		const existingTransaction = await this.transactionsService.findOne({
			where: {
				store_id: store.store_id,
				order_id: order.id.toString(),
			},
		})

		if (existingTransaction) {
			return await this.updateTransaction(existingTransaction, order)
		} else {
			return await this.createTransaction(order, store, installed_app)
		}
	}

	async createTransaction(order: any, store: Store, installed_app: InstalledApp): Promise<Transaction> {
		if (Modules.shopify.isInstalled) {
			const { ShopifyOrder } = await Modules.shopify.load()
			order as typeof ShopifyOrder
		}

		let contact: Contact
		let shipping_address: ContactAddress | undefined = undefined
		let billing_address: ContactAddress | undefined = undefined

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

		if (!order.order_number) {
			throw new Error(`Order number not found`)
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
			payment_status:
				(order.financial_status &&
					this.shopifyOrderFinancialStatusToEcommerceTransactionStatus(order.financial_status)) ??
				TransactionPaymentStatus.PENDING,
			fulfillment_status:
				(order.fulfillment_status &&
					this.shopifyOrderFulfillmentStatusToEcommerceTransactionStatus(order.fulfillment_status)) ??
				TransactionFulfillmentStatus.PENDING,
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
			order.discount_codes || [],
			store.account_id,
			transaction.transaction_id,
		)

		if (order.line_items) {
			for (const item of order.line_items) {
				const sku = await this.skusService.findBySku(item.sku)
				const bundle = await this.bundlesService.findBySku(item.sku)

				if (sku) {
					await this.transactionItemsService.create({
						transaction_id: transaction.transaction_id,
						sku_id: sku.sku_id,
						quantity: item.quantity,
					})
				} else if (bundle) {
					await this.transactionItemsService.create({
						transaction_id: transaction.transaction_id,
						bundle_id: bundle.bundle_id,
						quantity: item.quantity,
					})
				} else {
					this.logger.error(`SKU or Bundle not found for ${item.sku}`, {
						transaction,
						shopify_order: order,
						store,
					})
				}
			}
		}

		return transaction
	}

	async updateTransaction(transaction: Transaction, order: any): Promise<Transaction> {
		if (Modules.shopify.isInstalled) {
			const { ShopifyOrder } = await Modules.shopify.load()
			order as typeof ShopifyOrder
		}

		let has_changed = false
		const changed: UpdateTransactionDto = {}

		if (order.financial_status) {
			const newPaymentStatus = this.shopifyOrderFinancialStatusToEcommerceTransactionStatus(
				order.financial_status,
			)
			if (transaction.payment_status !== newPaymentStatus) {
				changed.payment_status = newPaymentStatus
				has_changed = true
			}
		}

		const newFulfillmentStatus = this.shopifyOrderFulfillmentStatusToEcommerceTransactionStatus(
			order.fulfillment_status || 'null',
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

	shopifyOrderFinancialStatusToEcommerceTransactionStatus(status: string): TransactionPaymentStatus {
		switch (status) {
			case 'authorized':
				return TransactionPaymentStatus.AURHORIZED
			case 'partially_paid':
				return TransactionPaymentStatus.PARTPAID
			case 'paid':
				return TransactionPaymentStatus.PAID
			case 'partially_refunded':
				return TransactionPaymentStatus.PATRIALREFUND
			case 'refunded':
				return TransactionPaymentStatus.REFUNDED
			case 'voided':
				return TransactionPaymentStatus.CANCELLED
			case 'pending':
			default:
				return TransactionPaymentStatus.PENDING
		}
	}

	shopifyOrderFulfillmentStatusToEcommerceTransactionStatus(status: any): TransactionFulfillmentStatus {
		switch (status) {
			case 'fulfilled':
				return TransactionFulfillmentStatus.SHIPPED
			case 'partial':
				return TransactionFulfillmentStatus.PARTIALLY_SHIPPED
			case 'restocked':
				return TransactionFulfillmentStatus.RETURNED
			case 'null':
			default:
				return TransactionFulfillmentStatus.PENDING
		}
	}

	async shopifyDiscountCodesToEcommerceDicounts(
		discounts: any[],
		account_id: number,
		transaction_id: number,
	): Promise<TransactionDiscount[]> {
		const transactionDiscounts: TransactionDiscount[] = []
		for (const discount of discounts) {
			let discount_type = TransactionDiscountType.FIXED

			switch (discount.type) {
				case 'fixed_amount':
					discount_type = TransactionDiscountType.FIXED
					break
				case 'percentage':
					discount_type = TransactionDiscountType.PERCENTAGE
					break
				case 'shipping':
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
