import {
	Contact,
	ContactAddressService,
	ContactEmailService,
	ContactPhoneService,
	ContactsService,
} from '@juicyllama/crm'
import {
	Store,
	Transaction,
	TransactionDiscountType,
	TransactionDiscountsService,
	TransactionFulfillmentStatus,
	TransactionPaymentStatus,
	TransactionsService,
} from '@juicyllama/ecommerce'
import { Env } from '@juicyllama/utils'
import { Test } from '@nestjs/testing'
import { ShopifyOrdersMapperService } from './orders.mapper.service'
import { ShopifyOrder } from './orders.dto'
import { ShopifyOrderDicountCodeType, ShopifyOrderFinancialStatus, ShopifyOrderFulfillmentStatus } from './orders.enums'
import { AppScope, InstalledApp } from '@juicyllama/app-store'

describe('OrdersMapperService', () => {
	let service: ShopifyOrdersMapperService
	let contactsService: jest.Mocked<ContactsService>
	let contactEmailsService: jest.Mocked<ContactEmailService>
	let contactAddressService: jest.Mocked<ContactAddressService>
	let contactPhoneService: jest.Mocked<ContactPhoneService>
	let transactionService: jest.Mocked<TransactionsService>
	let transactionsDiscountService: jest.Mocked<TransactionDiscountsService>
	const now = new Date()
	const order: ShopifyOrder = {
		admin_graphql_api_id: '1',
		app_id: 1,
		buyer_accepts_marketing: true,
		checkout_id: 1,
		confirmed: true,
		created_at: now,
		currency: 'USD',
		id: 1,
		name: 'test Order',
		number: 5,
		subtotal_price: 49.99,
		taxes_included: false,
		test: true,
		total_outstanding: 54.99,
		total_tax: 5.0,
		total_price: 54.99,
		updated_at: now,
		order_number: 1,
	}

	beforeAll(async () => {
		if (Env.IsNotTest()) {
			throw new Error('Test suite should not be ran in a non-test environment')
		}

		const modRef = await Test.createTestingModule({
			providers: [
				ShopifyOrdersMapperService,
				{
					provide: ContactsService,
					useValue: {
						findByEmail: jest.fn(),
						create: jest.fn(),
					},
				},
				{
					provide: ContactEmailService,
					useValue: {
						create: jest.fn(),
					},
				},
				{
					provide: ContactPhoneService,
					useValue: {
						create: jest.fn(),
					},
				},
				{
					provide: ContactAddressService,
					useValue: {
						create: jest.fn(),
					},
				},
				{
					provide: TransactionsService,
					useValue: {
						create: jest.fn(),
						update: jest.fn(),
					},
				},
				{
					provide: TransactionDiscountsService,
					useValue: {
						create: jest.fn(),
					},
				},
			],
		}).compile()

		service = modRef.get(ShopifyOrdersMapperService)
		contactsService = modRef.get(ContactsService)
		contactAddressService = modRef.get(ContactAddressService)
		contactEmailsService = modRef.get(ContactEmailService)
		contactPhoneService = modRef.get(ContactPhoneService)
		transactionService = modRef.get(TransactionsService)
		transactionsDiscountService = modRef.get(TransactionDiscountsService)
	})

	afterEach(() => {
		jest.resetAllMocks()
	})

	it('should create the service without error', () => {
		expect(service).toBeDefined()
	})

	describe('createEcommerceTransaction', () => {
		const installedApp: InstalledApp = {
			installed_app_id: 1234,
			active: true,
			app_id: 123,
			name: 'test app',
			scope: AppScope.ACCOUNT,
			settings: {
				SHOPIFY_SHOP_NAME: 'test',
			},
		}

		const store: Store = {
			account_id: 1,
			store_id: 1,
		}

		const transaction: Transaction = {
			account_id: 1,
			currency: 'USD',
			fulfillment_status: TransactionFulfillmentStatus.SHIPPED,
			installed_app_id: installedApp.installed_app_id,
			order_id: order.id.toString(),
			payment_status: TransactionPaymentStatus.AURHORIZED,
			store_id: 1,
			subtotal_price: 49.99,
			total_price: 54.99,
			total_tax: 5,
			transaction_id: 1,
		}

		it('should generate an email for the order', async () => {
			const contact = {
				account_id: 1,
				contact_id: 1,
				name: 'test Contact',
				tags_array: [],
			}
			contactsService.findByEmail.mockResolvedValueOnce(null as unknown as Contact)
			contactsService.create.mockResolvedValueOnce(contact)
			transactionService.create.mockResolvedValueOnce(transaction)
			expect(
				await service.createEcommerceTransaction({ ...order, discount_codes: [] }, store, installedApp),
			).toEqual({
				...transaction,
				contact,
				shipping_address: undefined,
				billing_address: undefined,
				discounts: [],
			})
			expect(contactEmailsService.create).toHaveBeenCalledWith({
				contact_id: 1,
				email: '1@test.myshopify.com',
			})
			expect(transactionService.create).toHaveBeenCalledTimes(1)
			expect(contactPhoneService.create).not.toHaveBeenCalled()
			expect(contactAddressService.create).not.toHaveBeenCalled()
		})

		it('should handle the order having a billing address and shipping address with phone number', async () => {
			const contact = {
				name: 'Found Test Contact',
				account_id: 1,
				contact_id: 1,
				tags_array: [],
			}
			contactsService.findByEmail.mockResolvedValueOnce(contact)
			contactAddressService.create
				.mockResolvedValueOnce({
					address_id: 1,
					contact_id: 1,
				})
				.mockResolvedValueOnce({
					address_id: 2,
					contact_id: 1,
				})
			transactionService.create.mockResolvedValueOnce(transaction)
			expect(
				await service.createEcommerceTransaction(
					{
						...order,
						discount_codes: [],
						billing_address: {
							phone: '1234567890',
							address1: 'business address 1',
						},
						shipping_address: {
							phone: '9876543210',
							address1: 'shipping address 1',
						},
					},
					store,
					installedApp,
				),
			).toEqual({
				...transaction,
				shipping_address: {
					address_id: 1,
					contact_id: 1,
				},
				billing_address: {
					address_id: 2,
					contact_id: 1,
				},
				contact,
				discounts: [],
			})
			expect(contactsService.create).not.toHaveBeenCalled()
			expect(contactPhoneService.create).toHaveBeenCalledTimes(2)
			expect(contactAddressService.create).toHaveBeenCalledTimes(2)
		})
	})

	describe('updateEcommerceTransaction', () => {
		const transaction: Transaction = {
			account_id: 1,
			currency: 'USD',
			fulfillment_status: TransactionFulfillmentStatus.SHIPPED,
			installed_app_id: 1,
			order_id: '1',
			payment_status: TransactionPaymentStatus.AURHORIZED,
			store_id: 1,
			subtotal_price: 49.99,
			total_price: 54.99,
			total_tax: 5,
			transaction_id: 1,
			total_outstanding: 54.99,
		}
		it('should handle when there are no changes to the transaction', async () => {
			expect(
				await service.updateEcommerceTransaction(transaction, {
					...order,
					fulfillment_status: ShopifyOrderFulfillmentStatus.fulfilled,
					financial_status: ShopifyOrderFinancialStatus.authorized,
				}),
			).toEqual(transaction)
			expect(transactionService.update).toHaveBeenCalledTimes(0)
		})

		it('should call the update method when there are changes', async () => {
			const changes = {
				subtotal_price: 59.99,
				total_price: 69.99,
				total_tax: 10,
				total_outstanding: 10,
				cancelled_at: new Date(),
				cancel_reason: 'testing',
			}
			expect(
				await service.updateEcommerceTransaction(transaction, {
					...order,
					fulfillment_status: ShopifyOrderFulfillmentStatus.partial,
					financial_status: ShopifyOrderFinancialStatus.partially_paid,
					...changes,
				}),
				// I'm not mocking the return of the `update` method, so jest sets it to `undefined`
			).toEqual(undefined)
			expect(transactionService.update).toHaveBeenCalledWith({
				transaction_id: 1,
				...changes,
				fulfillment_status: TransactionFulfillmentStatus.PARTIALLY_SHIPPED,
				payment_status: TransactionPaymentStatus.PARTPAID,
			})
		})
	})

	describe('shopifyOrderFinancialStatusToEcommerceTransactionStatus', () => {
		it.each`
			status                                            | expected
			${ShopifyOrderFinancialStatus.pending}            | ${TransactionPaymentStatus.PENDING}
			${ShopifyOrderFinancialStatus.authorized}         | ${TransactionPaymentStatus.AURHORIZED}
			${ShopifyOrderFinancialStatus.paid}               | ${TransactionPaymentStatus.PAID}
			${ShopifyOrderFinancialStatus.partially_paid}     | ${TransactionPaymentStatus.PARTPAID}
			${ShopifyOrderFinancialStatus.partially_refunded} | ${TransactionPaymentStatus.PATRIALREFUND}
			${ShopifyOrderFinancialStatus.refunded}           | ${TransactionPaymentStatus.REFUNDED}
			${ShopifyOrderFinancialStatus.voided}             | ${TransactionPaymentStatus.CANCELLED}
		`(
			`should change $status to $expected`,
			({ status, expected }: { status: ShopifyOrderFinancialStatus; expected: TransactionPaymentStatus }) => {
				expect(service.shopifyOrderFinancialStatusToEcommerceTransactionStatus(status)).toBe(expected)
			},
		)
	})

	describe('shopifyOrderFulfillmentStatusToEcommerceTransactionStatus', () => {
		it.each`
			status                                     | expected
			${ShopifyOrderFulfillmentStatus.fulfilled} | ${TransactionFulfillmentStatus.SHIPPED}
			${ShopifyOrderFulfillmentStatus.null}      | ${TransactionFulfillmentStatus.PENDING}
			${ShopifyOrderFulfillmentStatus.partial}   | ${TransactionFulfillmentStatus.PARTIALLY_SHIPPED}
			${ShopifyOrderFulfillmentStatus.restocked} | ${TransactionFulfillmentStatus.RETURNED}
		`(
			'should change $status to $expected',
			({
				status,
				expected,
			}: {
				status: ShopifyOrderFulfillmentStatus
				expected: TransactionFulfillmentStatus
			}) => {
				expect(service.shopifyOrderFulfillmentStatusToEcommerceTransactionStatus(status)).toBe(expected)
			},
		)
	})

	describe('shopifyDiscountCodesToEcommerceDicounts', () => {
		it('should handle each discount type in a single call', async () => {
			transactionsDiscountService.create
				.mockResolvedValueOnce({
					account_id: 1,
					transaction_discount_id: 1,
					type: TransactionDiscountType.FIXED,
					code: 'fixed',
					amount: 5,
				})
				.mockResolvedValueOnce({
					account_id: 1,
					transaction_discount_id: 2,
					code: 'sale',
					type: TransactionDiscountType.PERCENTAGE,
					amount: 2,
				})
				.mockResolvedValueOnce({
					account_id: 1,
					transaction_discount_id: 3,
					type: TransactionDiscountType.SHIPPING,
					code: 'FREESHIP',
					amount: 15,
				})
			expect(
				await service.shopifyDiscountCodesToEcommerceDicounts(
					[
						{
							code: 'fixed',
							amount: '5',
							type: ShopifyOrderDicountCodeType.fixed_amount,
						},
						{
							code: 'sale',
							amount: '2',
							type: ShopifyOrderDicountCodeType.percentage,
						},
						{
							code: 'FREESHIP',
							amount: '15',
							type: ShopifyOrderDicountCodeType.shipping,
						},
					],
					1,
					1,
				),
			).toEqual([
				{
					account_id: 1,
					transaction_discount_id: 1,
					type: TransactionDiscountType.FIXED,
					code: 'fixed',
					amount: 5,
				},
				{
					account_id: 1,
					transaction_discount_id: 2,
					code: 'sale',
					type: TransactionDiscountType.PERCENTAGE,
					amount: 2,
				},
				{
					account_id: 1,
					transaction_discount_id: 3,
					type: TransactionDiscountType.SHIPPING,
					code: 'FREESHIP',
					amount: 15,
				},
			])
			expect(transactionsDiscountService.create).toHaveBeenNthCalledWith(1, {
				account_id: 1,
				transaction_id: 1,
				code: 'fixed',
				type: TransactionDiscountType.FIXED,
				amount: 5,
			})
		})
	})
})
