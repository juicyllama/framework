// import { forwardRef, Inject, Injectable } from '@nestjs/common'
// import { AccountAppsService } from '@/api/accounts/modules/apps/accountApps.service'
// import { LessThanOrEqual } from 'typeorm'
// import { PaymentMethods } from '@/api/payments/enums/payment.enums'
// import { AppsService } from '@/api/apps/apps.service'
// import { BrandsService } from '@/api/brands/brands.service'
// import { Logger } from '@/common/logger'
// import { OrdersService } from '@/api/orders/orders.service'
// import { OrderLogsService } from '@/api/orders/modules/logs/order.logs.service'
// import { PaymentsService } from '@/api/payments/payments.service'
// import { AmazonSellerService } from '@/apps/amazon_seller/amazon.seller.service'
// import {
// 	AmazonOrderToBUQOrder,
// 	AmazonOrderToBUQOrderStatus,
// 	AmazonOrderToBUQPaymentStatus,
// } from '@/apps/amazon_seller/mappers/orders.mapper'
// import { AddressesService } from '@/api/customers/modules/addresses/addresses.service'
// import { AmazonSellerFulfillmentChannel } from '@/apps/amazon_seller/enums/amazon.seller.common.enums'
// import { AppIntegrationName } from '@/api/apps/enums/apps.enums'
// import { CustomersService } from '@/api/customers/customers.service'
// import { AmazonSellerOrderStatus } from '@/apps/amazon_seller/enums/amazon.seller.order.enums'
// import { OrderStatus } from '@/api/orders/order.enums'
// import Bugsnag from '@bugsnag/js'
// import { ConfigService } from '@nestjs/config'
// import { enviroment } from '@/common/enums/env'

// const app = 'amazon_seller'

// @Injectable()
// export class AmazonSellerCronService {
// 	constructor(
// 		@Inject(forwardRef(() => AppsService)) private readonly appsService: AppsService,
// 		@Inject(forwardRef(() => AddressesService)) private readonly addressesService: AddressesService,
// 		@Inject(forwardRef(() => AmazonSellerService)) private readonly amazonSellerService: AmazonSellerService,
// 		@Inject(forwardRef(() => AccountAppsService)) private readonly accountAppsService: AccountAppsService,
// 		@Inject(forwardRef(() => BrandsService)) private readonly brandsService: BrandsService,
// 		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
// 		@Inject(forwardRef(() => CustomersService)) private readonly customersService: CustomersService,
// 		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
// 		@Inject(forwardRef(() => OrdersService)) private readonly ordersService: OrdersService,
// 		@Inject(forwardRef(() => OrderLogsService)) private readonly orderLogsService: OrderLogsService,
// 		@Inject(forwardRef(() => PaymentsService)) private readonly paymentsService: PaymentsService,
// 	) {}

// 	async run(): Promise<void> {

// 		const domain = 'cron::apps::amazon_seller::run'

// 		if (![enviroment.test].includes(this.configService.get('NODE_ENV'))) {
// 			Bugsnag.addMetadata('cron', {
// 				domain: domain,
// 			})
// 		}

// 		const amazon_seller_app = await this.appsService.findOne({ where: { integration_name: app } })

// 		const account_apps = await this.accountAppsService.findAll({
// 			where: {
// 				app_id: amazon_seller_app.app_id,
// 				active: true,
// 				next_check_at: LessThanOrEqual(new Date()),
// 			},
// 			relations: ['app'],
// 		})

// 		this.logger.debug(`[${domain}] Found ${account_apps.length} Account Apps`)

// 		for(const account_app of account_apps){

// 				const checked_at = new Date()
// 				const checked_start = new Date(account_app.last_check_at)
// 				const next_check_at = new Date()
// 				next_check_at.setMinutes(next_check_at.getMinutes() +30)

// 				const amazon_orders = await this.amazonSellerService.findMany(account_app, 100, checked_start)

// 				if(amazon_orders && amazon_orders.length){
// 					this.logger.debug(`[${domain}][Account App #${account_app.id}] ${amazon_orders.length} orders found`)

// 					for(let amazon of amazon_orders){

// 						try {

// 							const uuid = amazon.order.AmazonOrderId

// 							this.logger.debug(`[${domain}][${uuid}] Amazon Order`, amazon)

// 							const brand = await this.brandsService.findBySku(account_app.account_id, amazon.items[0].SellerSKU)

// 							if (!brand) {
// 								this.logger.error(`[${domain}][${uuid}] No brand found for sku ${amazon.items[0].SellerSKU}`, amazon)
// 								continue
// 							}

// 							const exiting_order = await this.ordersService.findOne({
// 								where: [{ order_id: amazon.order.AmazonOrderId, brand_id: brand.id }],
// 							})

// 							if(exiting_order){

// 								switch (amazon.order.OrderStatus) {
// 									case AmazonSellerOrderStatus.Canceled:
// 										this.logger.debug(`[${domain}][${uuid}] Amazon order (${amazon.order.OrderStatus})`)
// 										await this.ordersService.updateStatus(exiting_order.id, OrderStatus.CANCELED)
// 										continue
// 									case AmazonSellerOrderStatus.Shipped:
// 										this.logger.debug(`[${domain}][${uuid}] Amazon order (${amazon.order.OrderStatus})`)
// 										await this.ordersService.updateStatus(exiting_order.id, OrderStatus.COMPLETE)
// 										continue
// 								}

// 								this.logger.debug(`[${domain}][${uuid}] Order already exists #${exiting_order.id} - skipping`)
// 								continue
// 							}

// 							switch (amazon.order.OrderStatus) {
// 								case AmazonSellerOrderStatus.Canceled:
// 									this.logger.debug(`[${domain}][${uuid}] Skipping order (${amazon.order.OrderStatus})`)
// 									continue
// 							}

// 							amazon.address = await this.amazonSellerService.getOrderAddress(account_app, uuid)
// 							amazon.customer = await this.amazonSellerService.getOrderBuyerInfo(account_app, uuid)

// 							const buq_order = await this.ordersService.create(await AmazonOrderToBUQOrder(amazon, brand, account_app), false, uuid)

// 							if (!buq_order) {
// 								this.logger.error(`[${domain}][${uuid}] Issue creating order!`, amazon)
// 								continue
// 							}

// 							const payment = await this.paymentsService.create({
// 								brand_id: brand.id,
// 								order_id: buq_order.id,
// 								store_id: buq_order.order_id,
// 								ext_id: amazon.order.AmazonOrderId,
// 								payment_method: PaymentMethods.AMAZON_MARKETPLACE,
// 								account_app_id: account_app.id,
// 								ext_status: AmazonOrderToBUQPaymentStatus(amazon),
// 								fetch_update: false
// 							})

// 							await this.ordersService.update(buq_order.id, {
// 								status: AmazonOrderToBUQOrderStatus(amazon),
// 								account_app_id: account_app.id,
// 								payment_id: payment.payment_id,
// 								paid: [OrderStatus.PROCESSING, OrderStatus.COMPLETE].includes(AmazonOrderToBUQOrderStatus(amazon))
// 							}, uuid)

// 							switch (amazon.order.FulfillmentChannel) {
// 								case AmazonSellerFulfillmentChannel.AFN:
// 									this.logger.debug(`[${domain}][${uuid}] Amazon fulfilled order`)
// 									await this.orderLogsService.create(buq_order.id, {
// 										type: AppIntegrationName.amazon_seller,
// 										message: `Amazon FBA Order`,
// 										json: amazon
// 									}, uuid)
// 									break
// 								case AmazonSellerFulfillmentChannel.MFN:
// 									this.logger.debug(`[${domain}][${uuid}] Merchant fulfilled order`, amazon)
// 									await this.orderLogsService.create(buq_order.id, {
// 										type: AppIntegrationName.amazon_seller,
// 										message: `Amazon FBM Order`,
// 										json: amazon
// 									}, uuid)

// 									//Amazon will not grant our application PII access at this time so we need to manually repair orders
// 									await this.ordersService.updateStatus(buq_order.id, OrderStatus.HOLD_ADDRESS)

// 									await this.orderLogsService.create(buq_order.id, {
// 										type: AppIntegrationName.amazon_seller,
// 										message: `Address needs manually updating via Amazon`
// 									}, uuid)

// 									break
// 							}

// 							this.logger.debug(`[${domain}][${uuid}] Order added successfully`)

// 						}catch (e) {
// 							this.logger.error(`[${domain}] ${e.message}`, {
// 								message: e.message,
// 								stack: e.stack
// 							})
// 						}

// 					}
// 				}

// 				await this.accountAppsService.update(account_app.id, {
// 					last_check_at: checked_at,
// 					next_check_at: next_check_at
// 				})
// 			}
// 	}

// }
