import { Controller, forwardRef, Inject, Get, Query, Post, BadRequestException, Body } from '@nestjs/common'
import { ApiHideProperty } from '@nestjs/swagger'
import { Logger } from '@juicyllama/utils'
import { InstalledAppsService } from '@juicyllama/app-store'
import { AccountId, UserAuth } from '@juicyllama/core'
import { ShopifyOrdersService } from './orders.service'
import { ApiVersion } from '@shopify/shopify-api'
import { Transaction } from '@juicyllama/ecommerce'
import { ShopifyOrder } from './orders.dto'

@Controller('app/shopify/orders')
export class ShopifyOrdersController {
	constructor(
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => ShopifyOrdersService)) private readonly shopifyOrdersService: ShopifyOrdersService,
		@Inject(forwardRef(() => InstalledAppsService)) private readonly installedAppsService: InstalledAppsService,
	) {}
	
	/**
	 * This endpoint is used to sync orders from Shopify to the Ecommerce transactions table. It returns the transactions that were synced.
	 */

	@UserAuth()
	@ApiHideProperty()
	@Get('sync')
	async sync(@Query('installed_app_id') installed_app_id: number, @AccountId() account_id: string, @Query() query: any): Promise<Transaction[]> {
		const domain = 'app::shopify::orders::controller::sync'

		this.logger.log(`[${domain}] Sync Orders`, {
			installed_app_id: installed_app_id, 
			account_id: account_id,
		})

		const installed_app = await this.installedAppsService.findOne({ where: { account_id: account_id, installed_app_id: installed_app_id } })

		if(!installed_app) {
			this.logger.error(`[${domain}] Authentication Error: Installed App not found`, {
				installed_app_id: installed_app_id, 
				account_id: account_id,
			})
			throw new BadRequestException(`Authentication Error: Installed App not found`)
		} 

		delete query.installed_app_id

		return await this.shopifyOrdersService.syncOrders(installed_app, {
			api_version: ApiVersion.April23,
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
	async list(@Query('installed_app_id') installed_app_id: number, @AccountId() account_id: string, @Query() query: any): Promise<ShopifyOrder[]> {
		const domain = 'app::shopify::orders::controller::list'

		this.logger.log(`[${domain}] List Orders`, {
			installed_app_id: installed_app_id, 
			account_id: account_id,
		})

		const installed_app = await this.installedAppsService.findOne({ where: { account_id: account_id, installed_app_id: installed_app_id } })

		if(!installed_app) {
			this.logger.error(`[${domain}] Authentication Error: Installed App not found`, {
				installed_app_id: installed_app_id, 
				account_id: account_id,
			})
			throw new BadRequestException(`Authentication Error: Installed App not found`)
		} 

		delete query.installed_app_id

		return await this.shopifyOrdersService.listOrders(installed_app, {
			api_version: ApiVersion.April23,
			status: 'any',
			...query,
		})
	}


}
