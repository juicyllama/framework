//https://github.com/amzn/selling-partner-api-docs/blob/main/references/orders-api/ordersV0.md

import { forwardRef, Inject, Injectable } from '@nestjs/common'
import {
	AmazonSellerFullOrderDto,
	AmazonSellerOrderAddressResponseDto,
	AmazonSellerOrderBuyerInfoDto,
	AmazonSellerOrderBuyerInfoResponseDto,
	AmazonSellerOrderDto,
	AmazonSellerOrderItemsItemDto,
	AmazonSellerOrderItemsResponseDto,
	AmazonSellerOrderResponseDto,
	AmazonSellerOrdersResponseDto,
} from './amazon.seller.order.dto'
import { Api, Logger } from '@juicyllama/utils'
import { isNil, omitBy } from 'lodash'
import { InstalledApp } from '@juicyllama/app-store'
import { AmazonSellerAppCredentialsDto } from '../../config/app.credentials.dto'
import { AmazonSellerAuthService } from '../auth/amazon.seller.oauth.service'
import { AmazonSellerAddressDto } from '../amazon.seller.common.dto'

@Injectable()
export class AmazonSellerOrdersService {
	constructor(
		@Inject(forwardRef(() => Api)) private readonly api: Api,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => AmazonSellerAuthService))
		private readonly amazonSellerAuthService: AmazonSellerAuthService,
	) {}

	/**
	 * Get full order details from amazon (order, items, buyerinfo, address)
	 */

	async findOne(installed_app: InstalledApp, amazon_order_id: string): Promise<AmazonSellerFullOrderDto> {
		const order = await this.getOrder(installed_app, amazon_order_id)
		const items = await this.getOrderItems(installed_app, amazon_order_id)
		const customer = await this.getOrderBuyerInfo(installed_app, amazon_order_id)
		const address = await this.getOrderAddress(installed_app, amazon_order_id)

		return {
			order: order,
			items: items,
			customer: customer,
			address: address,
		}
	}

	/**
	 * Get orders from amazon (order, items, buyerinfo, address)
	 *
	 * @param {InstalledApp} installed_app
	 * @param {number} [limit] number of records to return
	 * @param {Date} [since] a date to get results from
	 */

	async findMany(installed_app: InstalledApp, limit?: number, since?: Date): Promise<AmazonSellerFullOrderDto[]> {
		const domain = 'apps::amazon_seller::api::AmazonSellerOrdersService::findMany'

		const result = []

		const orders = await this.getOrders(installed_app, limit, since)

		if (orders) {
			this.logger.debug(`[${domain}] Found ${orders.length} orders`)

			if (orders.length === 0) {
				return []
			}

			for (const order of orders) {
				const items = await this.getOrderItems(installed_app, order.AmazonOrderId)

				result.push(<AmazonSellerFullOrderDto>{
					order: order,
					items: items,
				})
			}
		}

		return result
	}

	private async getOrders(
		installed_app: InstalledApp,
		limit?: number,
		since?: Date,
	): Promise<AmazonSellerOrderDto[] | undefined> {
		installed_app.settings = <AmazonSellerAppCredentialsDto>installed_app.settings

		const domain = 'apps::amazon_seller::api::AmazonSellerOrdersService::getOrders'

		let url = `${this.amazonSellerAuthService.url(installed_app)}/orders/v0/orders`

		if (!limit) {
			limit = 100
		}

		const params = {
			MarketplaceIds: installed_app.settings.MARKETPLACE_ID,
			MaxResultsPerPage: limit.toString(),
			OrderStatuses:
				'Unshipped,PartiallyShipped,Shipped,Canceled,Unfulfillable,InvoiceUnconfirmed,PendingAvailability',
			LastUpdatedAfter: since
				? since.toISOString()
				: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
		}

		url += '?' + new URLSearchParams(omitBy(params, isNil)).toString()

		const config = await this.amazonSellerAuthService.config(installed_app)

		try {
			let response = await this.api.get(domain, url, config)
			response = <AmazonSellerOrdersResponseDto>response

			if (response && response.payload) {
				return response.payload.Orders
			} else {
				return
			}
		} catch (e: any) {
			this.logger.error(`[${domain}] ${e.message}`, {
				request: {
					url: url,
					config: config,
				},
				error: {
					message: e.message,
					stack: e.stack,
				},
				installed_app: installed_app,
			})
			return
		}
	}

	private async getOrder(
		installed_app: InstalledApp,
		amazon_order_id: string,
	): Promise<AmazonSellerOrderDto | undefined> {
		const domain = 'apps::amazon_seller::api::AmazonSellerOrdersService::getOrder'

		try {
			const config = await this.amazonSellerAuthService.config(installed_app)

			const url = `${this.amazonSellerAuthService.url(installed_app)}/orders/v0/orders/${amazon_order_id}`
			let response = await this.api.get(domain, url, config)

			response = <AmazonSellerOrderResponseDto>response
			return <AmazonSellerOrderDto>response.payload
		} catch (e: any) {
			this.logger.error(`[${domain}][${amazon_order_id}] ${e.message}`, {
				amazon_order_id: amazon_order_id,
				error: {
					message: e.message,
					stack: e.stack,
				},
				installed_app: installed_app,
			})
			return
		}
	}

	async getOrderItems(
		installed_app: InstalledApp,
		amazon_order_id: string,
	): Promise<AmazonSellerOrderItemsItemDto[] | undefined> {
		const domain = 'apps::amazon_seller::api::AmazonSellerOrdersService::getOrderItems'

		try {
			const config = await this.amazonSellerAuthService.config(installed_app)

			const url = `${this.amazonSellerAuthService.url(installed_app)}/orders/v0/orders/${amazon_order_id}/orderItems`
			let response = await this.api.get(domain, url, config, amazon_order_id)
			response = <AmazonSellerOrderItemsResponseDto>response

			if (response?.payload?.OrderItems) {
				return <AmazonSellerOrderItemsItemDto[]>response.payload.OrderItems
			} else {
				return
			}
		} catch (e: any) {
			this.logger.error(`[${domain}][${amazon_order_id}] ${e.message}`, {
				amazon_order_id: amazon_order_id,
				error: {
					message: e.message,
					stack: e.stack,
				},
				installed_app: installed_app,
			})
			return
		}
	}

	async getOrderBuyerInfo(
		installed_app: InstalledApp,
		amazon_order_id: string,
	): Promise<AmazonSellerOrderBuyerInfoDto | undefined> {
		const domain = 'apps::amazon_seller::api::AmazonSellerOrdersService::getOrderBuyerInfo'

		try {
			const config = await this.amazonSellerAuthService.config(installed_app)
			const url = `${this.amazonSellerAuthService.url(installed_app)}/orders/v0/orders/${amazon_order_id}/buyerInfo`
			const response = <AmazonSellerOrderBuyerInfoResponseDto>(
				await this.api.get(domain, url, config, amazon_order_id)
			)
			return <AmazonSellerOrderBuyerInfoDto>response.payload
		} catch (e: any) {
			this.logger.error(`[${domain}][${amazon_order_id}] ${e.message}`, {
				amazon_order_id: amazon_order_id,
				error: {
					message: e.message,
					stack: e.stack,
				},
				installed_app: installed_app,
			})
			return
		}
	}

	async getOrderAddress(
		installed_app: InstalledApp,
		amazon_order_id: string,
	): Promise<AmazonSellerAddressDto | undefined> {
		const domain = 'apps::amazon_seller::api::AmazonSellerOrdersService::getOrderAddress'

		try {
			const config = await this.amazonSellerAuthService.config(installed_app)

			const url = `${this.amazonSellerAuthService.url(installed_app)}/orders/v0/orders/${amazon_order_id}/address`
			let response = await this.api.get(domain, url, config, amazon_order_id)
			response = <AmazonSellerOrderAddressResponseDto>response
			if (response?.payload?.ShippingAddress) {
				return <AmazonSellerAddressDto>response.payload.ShippingAddress
			} else {
				return
			}
		} catch (e: any) {
			this.logger.error(`[${domain}][${amazon_order_id}] ${e.message}`, {
				amazon_order_id: amazon_order_id,
				error: {
					message: e.message,
					stack: e.stack,
				},
				installed_app: installed_app,
			})
			return
		}
	}
}
