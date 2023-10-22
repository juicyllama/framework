import { Controller, forwardRef, Inject, Get, Query, Req, Res, BadRequestException } from '@nestjs/common'
import { ApiHideProperty } from '@nestjs/swagger'
import { Logger, Strings } from '@juicyllama/utils'
import { ShopifyAuthRedirectQuery } from './auth.dto'
import { Shopify, ShopifyAuthRedirect, ShopifyAuthScopes } from '../../config/shopify.config'
import { ConfigService } from '@nestjs/config'
import {
	AppIntegrationStatus,
	InstalledAppsService,
	Oauth,
	OauthService,
	AppsService,
	AppStoreIntegrationName,
} from '@juicyllama/app-store'
import { AccountId, UserAuth } from '@juicyllama/core'
import { v4 as uuidv4 } from 'uuid'
import { StoresService } from '@juicyllama/ecommerce'

@Controller('app/shopify/auth')
export class ShopifyAuthController {
	constructor(
		@Inject(forwardRef(() => AppsService)) private readonly appsService: AppsService,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
		@Inject(forwardRef(() => OauthService)) private readonly oauthService: OauthService,
		@Inject(forwardRef(() => InstalledAppsService)) private readonly installedAppsService: InstalledAppsService,
		@Inject(forwardRef(() => StoresService)) private readonly storesService: StoresService,
	) {}

	@UserAuth()
	@ApiHideProperty()
	@Get('install')
	async install(
		@Req() req: any,
		@Query('installed_app_id') installed_app_id: number,
		@AccountId() account_id: string,
	): Promise<Oauth> {
		const domain = 'app::shopify::auth::controller::start'

		this.logger.log(`[${domain}] Install`, {
			installed_app_id: installed_app_id,
			account_id: account_id,
			user: req.user,
		})

		const installed_app = await this.installedAppsService.findOne({
			where: {
				installed_app_id: installed_app_id,
				account_id: account_id,
			},
		})

		if (!installed_app) {
			throw new BadRequestException(`Installed App not found`)
		}

		if (!installed_app.settings?.SHOPIFY_SHOP_NAME) {
			throw new BadRequestException(`Shopify Shop Name not found in App settings`)
		}

		//Skipping Oauth as SHOPIFY_ADMIN_API_ACCESS_KEY provided
		if (installed_app.settings?.SHOPIFY_ADMIN_API_ACCESS_KEY) {
			this.logger.log(`[${domain}] Skipping Oauth as SHOPIFY_ADMIN_API_ACCESS_KEY provided`)

			const installed_app = await this.installedAppsService.update({
				installed_app_id: installed_app_id,
				integration_status: AppIntegrationStatus.CONNECTED,
			})

			await this.storesService.create({
				account_id: installed_app.account_id,
				installed_app_id: installed_app.installed_app_id,
			})

			const oath = await this.oauthService.findOne({ where: { installed_app_id: installed_app_id } })

			if (oath) {
				return await this.oauthService.update({
					oauth_id: oath.oauth_id,
					installed_app_id: installed_app_id,
					access_token: installed_app.settings.SHOPIFY_ADMIN_API_ACCESS_KEY,
					redirect_url: process.env.BASE_URL_APP,
				})
			}

			return await this.oauthService.create({
				installed_app_id: installed_app_id,
				access_token: installed_app.settings.SHOPIFY_ADMIN_API_ACCESS_KEY,
				redirect_url: process.env.BASE_URL_APP,
			})
		}

		const state = uuidv4()

		const redirect = `https://${
			installed_app.settings.SHOPIFY_SHOP_NAME
		}.myshopify.com/admin/oauth/authorize?client_id=${this.configService.get<string>(
			'shopify.SHOPIFY_APP_CLIENT_ID',
		)}&scope=${ShopifyAuthScopes.toString()}&redirect_uri=${
			process.env.BASE_URL_API
		}${ShopifyAuthRedirect}&state=${state}`

		const oath = await this.oauthService.findOne({ where: { installed_app_id: installed_app_id } })

		if (oath) {
			return await this.oauthService.update({
				oauth_id: oath.oauth_id,
				installed_app_id: installed_app_id,
				state: state,
				redirect_url: redirect,
			})
		}

		return await this.oauthService.create({
			installed_app_id: installed_app_id,
			state: state,
			redirect_url: redirect,
		})
	}

	@ApiHideProperty()
	@Get('redirect')
	async redirect(@Query() query: ShopifyAuthRedirectQuery, @Req() req: any, @Res() res: any): Promise<void> {
		const domain = 'app::shopify::auth::controller::redirect'
		this.logger.log(`[${domain}] Redirect`, query)

		res.setHeader('Set-Cookie', [`app_shopify_state=${query.state}; Path=/;`])

		const shopify = Shopify(this.configService.get('shopify'))
		await shopify.auth.begin({
			shop: shopify.utils.sanitizeShop(query.shop, true),
			callbackPath: `/app/shopify/auth/complete`,
			isOnline: false,
			rawRequest: req,
			rawResponse: res,
		})
		return
	}

	@ApiHideProperty()
	@Get('complete')
	async complete(@Query() query: ShopifyAuthRedirectQuery, @Req() req: any, @Res() res: any): Promise<void> {
		const domain = 'app::shopify::auth::controller::complete'
		this.logger.log(`[${domain}] Complete`, query)

		const shopify = Shopify(this.configService.get('shopify'))

		const callback = await shopify.auth.callback({
			rawRequest: req,
			rawResponse: res,
		})

		this.logger.log(`[${domain}] Callback`, {
			callback: callback,
			state: req.cookies.app_shopify_state,
			reidrect_url: req.cookies.app_shopify_redirect_url,
		})

		const oath = await this.oauthService.findOne({ where: { state: req.cookies.app_shopify_state } })

		if (!oath) {
			throw new BadRequestException('Invalid Oauth State, please ensure you are connecting from the app.')
		}

		await this.oauthService.update({
			oauth_id: oath.oauth_id,
			access_token: callback.session.accessToken,
			scope: callback.session.scope,
			token_type: 'OFFLINE',
			expires_at: callback.session.expires,
		})

		const installed_app = await this.installedAppsService.update({
			installed_app_id: oath.installed_app_id,
			integration_status: AppIntegrationStatus.CONNECTED,
		})

		await this.storesService.create({
			account_id: installed_app.account_id,
			installed_app_id: installed_app.installed_app_id,
		})

		if (req.cookies.app_shopify_redirect_url) {
			this.logger.log(
				`[${domain}] Kicked off from shopify, redirecting to: ${req.cookies.app_shopify_redirect_url}`,
			)

			//clean up and redirect
			const redirect = req.cookies.app_shopify_redirect_url
			res.setHeader('Set-Cookie', [`app_shopify_state=deleted; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`])
			res.setHeader('Set-Cookie', [`app_shopify_redirect_url=deleted; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`])
			res.redirect(redirect)
			return
		} else {

			//clean up and redirect
			res.setHeader('Set-Cookie', [`app_shopify_state=deleted; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`])
			res.redirect(process.env.BASE_URL_APP)
			return
		}
	}

	/**
	 * This endpoint is used to pass the shopify app approval process
	 */
	@ApiHideProperty()
	@Get('open')
	async open(@Query() query: ShopifyAuthRedirectQuery, @Req() req: any, @Res() res: any): Promise<void> {
		const domain = 'app::shopify::auth::controller::redirect'
		this.logger.log(`[${domain}] Open`, query)

		const shop = query.shop.replace('.myshopify.com', '')

		const shopify_app = await this.appsService.findOne({
			where: {
				integration_name: AppStoreIntegrationName.shopify,
			},
		})

		const installed_app = await this.installedAppsService.create({
			account_id: query?.account_id || 1,
			app_id: shopify_app.app_id,
			name: shop,
			settings: {
				SHOPIFY_SHOP_NAME: shop,
			},
		})

		if (query.redirect_url) {
			query.redirect_url = Strings.replacer(query.redirect_url, {
				installed_app_id: installed_app.installed_app_id,
			})
		}

		await this.oauthService.create({
			installed_app_id: installed_app.installed_app_id,
			state: query.state,
			redirect_url: query.redirect_url,
		})

		res.setHeader('Set-Cookie', [`app_shopify_redirect_url=${query.redirect_url}; Path=/;`])
		res.setHeader('Set-Cookie', [`app_shopify_state=${query.state}; Path=/;`])

		const shopify = Shopify(this.configService.get('shopify'))
		await shopify.auth.begin({
			shop: shopify.utils.sanitizeShop(query.shop, true),
			callbackPath: `/app/shopify/auth/complete`,
			isOnline: false,
			rawRequest: req,
			rawResponse: res,
		})
		return
	}
}
