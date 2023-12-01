import { InstalledAppsService } from '@juicyllama/app-store'
import { AccountId, UserAuth } from '@juicyllama/core'
import { Transaction } from '@juicyllama/ecommerce'
import { Logger } from '@juicyllama/utils'
import { Controller, Get, Query, BadRequestException, Body, Post } from '@nestjs/common'
import { ApiHideProperty } from '@nestjs/swagger'
import { ApiVersion } from '@shopify/shopify-api'
import { ShopifyOrder } from './orders.dto'
import { ShopifyOrdersService } from './orders.service'

@Controller('app/shopify/orders')
export class ShopifyOrdersController {
	constructor(
		private readonly logger: Logger,
		private readonly shopifyOrdersService: ShopifyOrdersService,
		private readonly installedAppsService: InstalledAppsService,
	) {}

	/**
	 * This endpoint is used to sync orders from Shopify to the Ecommerce transactions table. It returns the transactions that were synced.
	 */

	@UserAuth()
	@ApiHideProperty()
	@Get('sync')
	async sync(
		@AccountId() account_id: number,
		@Query() { installed_app_id, ...query }: { installed_app_id: number; [key: string]: any },
	): Promise<Transaction[]> {
		const domain = 'app::shopify::orders::controller::sync'

		this.logger.log(`[${domain}] Sync Orders`, {
			installed_app_id: installed_app_id,
			account_id: account_id,
		})

		const installed_app = await this.installedAppsService.findOne({
			where: { account_id: account_id, installed_app_id: installed_app_id },
		})

		if (!installed_app) {
			this.logger.error(`[${domain}] Authentication Error: Installed App not found`, {
				installed_app_id: installed_app_id,
				account_id: account_id,
			})
			throw new BadRequestException(`Authentication Error: Installed App not found`)
		}

		return await this.shopifyOrdersService.syncOrders(installed_app, {
			api_version: ApiVersion.July23,
			status: 'any',
			...query,
		})
	}

	/**
	 * This endpoint returns orders direct from shopify
	 */

	@UserAuth()
	@ApiHideProperty()
	@Get('list')
	async list(
		@AccountId() account_id: number,
		@Query() { installed_app_id, ...query }: { installed_app_id: number; [key: string]: any },
	): Promise<ShopifyOrder[]> {
		const domain = 'app::shopify::orders::controller::list'

		this.logger.log(`[${domain}] List Orders`, {
			installed_app_id: installed_app_id,
			account_id: account_id,
		})

		const installed_app = await this.installedAppsService.findOne({
			where: { account_id: account_id, installed_app_id: installed_app_id },
		})

		if (!installed_app) {
			this.logger.error(`[${domain}] Authentication Error: Installed App not found`, {
				installed_app_id: installed_app_id,
				account_id: account_id,
			})
			throw new BadRequestException(`Authentication Error: Installed App not found`)
		}

		return await this.shopifyOrdersService.listOrders(installed_app, {
			api_version: ApiVersion.July23,
			status: 'any',
			...query,
		})
	}

	/**
	 * This endpoint returns orders direct from shopify
	 */

	@ApiHideProperty()
	@Post('webhook')
	async webhook(
		@Query('installed_app_id') installed_app_id: number,
		@Body() data: ShopifyOrder,
	): Promise<Transaction> {
		const domain = 'app::shopify::orders::controller::webhook'

		this.logger.log(`[${domain}] Order Webhook`, {
			data: data,
		})

		const installed_app = await this.installedAppsService.findOne({
			where: { installed_app_id: installed_app_id },
		})

		if (!installed_app) {
			this.logger.error(`[${domain}] Authentication Error: Installed App not found`, {
				installed_app_id: installed_app_id,
			})
			throw new BadRequestException(`Authentication Error: Installed App not found`)
		}

		return await this.shopifyOrdersService.addOrUpdateOrder(installed_app, data)
	}
}
