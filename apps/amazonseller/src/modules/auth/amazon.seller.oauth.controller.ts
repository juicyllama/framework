import { Body, Controller, forwardRef, Get, Res, Req, BadRequestException, Inject, Query } from '@nestjs/common'
import { Logger, Env, Api } from '@juicyllama/utils'
import { UserAuth, AccountId } from '@juicyllama/core'
import { ApiExcludeController } from '@nestjs/swagger'
import { AmazonSellerAppCredentialsDto } from '../../config/app.credentials.dto'
import { AmazonSellerOauthRedirectDto } from './amazon.seller.oauth.dto'
import {
	AppsService,
	InstalledAppsService,
	Oauth,
	OauthService,
	AppStoreIntegrationName,
	AppIntegrationStatus,
} from '@juicyllama/app-store'
import { v4 as uuidv4 } from 'uuid'
import { AmazonSellerMarketplaceDto } from '../amazon.seller.common.dto'
import MARKETPLACES from '../../config/_marketplaces.json'
import { amazonSellerConfig } from '../../config/amazon.seller.config'
import { filter } from 'lodash'

@Controller(`/app/amazonseller/auth`)
@ApiExcludeController()
export class AmazonSellerOauthController {
	constructor(
		@Inject(forwardRef(() => OauthService)) readonly oauthService: OauthService,
		@Inject(forwardRef(() => AppsService)) readonly appsService: AppsService,
		@Inject(forwardRef(() => InstalledAppsService)) readonly installedAppsService: InstalledAppsService,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => Api)) private readonly api: Api,
	) {}

	@UserAuth()
	@Get('install')
	async install(
		@Req() req: any,
		@Query('installed_app_id') installed_app_id: number,
		@AccountId() account_id: string,
	): Promise<Oauth> {
		const domain = 'app::amazonseller::auth::controller::install'
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

		const state = uuidv4()

		installed_app.settings = <AmazonSellerAppCredentialsDto>installed_app.settings
		const result = <AmazonSellerMarketplaceDto[]>(
			filter(MARKETPLACES, { marketplaceId: installed_app.settings.MARKETPLACE_ID })
		)

		let redirect_url = `${result[0].url}/apps/authorize/consent?`
		redirect_url += `application_id=${amazonSellerConfig().APP_ID}`
		redirect_url += `&redirect_uri=${process.env.BASE_URL_API}/app/amazonseller/auth/redirect?state=${state}`

		if (Env.IsNotProd()) {
			redirect_url += '&version=beta'
		}

		this.logger.debug(`[${domain}][Account #${installed_app.account_id}] Redirect URL: ${redirect_url}`)

		const oath = await this.oauthService.findOne({ where: { installed_app_id } })

		if (oath) {
			return await this.oauthService.update({
				oauth_id: oath.oauth_id,
				installed_app_id,
				state,
				redirect_url,
			})
		}

		return await this.oauthService.create({
			installed_app_id,
			state,
			redirect_url,
		})
	}

	@Get('redirect')
	async redirect(@Query() query: AmazonSellerOauthRedirectDto, @Body() body: any, @Res() res: any): Promise<void> {
		const domain = 'app::amazonseller::auth::controller::redirect'

		this.logger.log(`[${domain}] Redirect`, {
			query: query,
			body: body,
		})

		const app = await this.appsService.findOne({
			where: {
				integration_name: AppStoreIntegrationName.amazonseller,
			},
		})

		const installed_apps = await this.installedAppsService.findAll({
			where: {
				app_id: app.app_id,
			},
		})

		res.setHeader('Set-Cookie', [`app_amazonseller_state=${query.amazon_state}; Path=/;`])

		for (const installed_app of installed_apps) {
			installed_app.settings = <AmazonSellerAppCredentialsDto>installed_app.settings

			if (installed_app.settings.SELLER_ID === query.selling_partner_id) {
				this.logger.debug(
					`[${domain}][Installed App #${installed_app.installed_app_id}] Matched partner id ${query.selling_partner_id}`,
				)

				const oath = await this.oauthService.findOne({
					where: { installed_app_id: installed_app.installed_app_id },
				})

				if (!oath) {
					this.logger.warn(`[${domain}][Installed App #${installed_app.installed_app_id}] No Oauth found`)
					throw new BadRequestException(`No Oauth found`)
				}

				let redirect = `${query.amazon_callback_uri}?amazon_state=${query.amazon_state}&state=${oath.state}&redirect_uri=${process.env.BASE_URL_API}/app/amazonseller/auth/complete`

				if (Env.IsNotProd()) {
					redirect += '&version=beta'
				}

				await this.oauthService.update({
					oauth_id: oath.oauth_id,
					installed_app_id: installed_app.installed_app_id,
					redirect_url: redirect,
					state: query.amazon_state,
				})

				this.logger.debug(
					`[${domain}][Installed App #${installed_app.installed_app_id}] Redirecting back to amazon: ${redirect}`,
				)

				res.redirect(redirect)
			}
		}

		throw new BadRequestException(`No installed app found with seller partner id ${query.selling_partner_id}`)
	}

	@Get('complete')
	async complete(@Query() query: any, @Req() req: any, @Res() res: any): Promise<void> {
		const domain = 'app::shoamazonsellerpify::auth::controller::complete'

		this.logger.log(`[${domain}] Complete`, {
			query,
			state: req.cookies.app_amazonseller_state,
		})

		const oath = await this.oauthService.findOne({ where: { state: req.cookies.app_amazonseller_state } })

		if (!oath) {
			throw new BadRequestException('Invalid Oauth State, please ensure you are connecting from the app.')
		}

		const url = 'https://api.amazon.com/auth/o2/token'

		const data = {
			grant_type: 'authorization_code',
			code: query.spapi_oauth_code,
			client_id: amazonSellerConfig().CLIENT_ID,
			client_secret: amazonSellerConfig().CLIENT_SECRET,
		}

		const response = await this.api.post(domain, url, data)

		this.logger.debug(`[${domain}][Installed App #${oath.installed_app_id}] Oauth response`, response)

		const expires_at = new Date()
		expires_at.setSeconds(expires_at.getSeconds() + response.expires_in)

		await this.oauthService.update({
			oauth_id: oath.oauth_id,
			access_token: response.access_token,
			refresh_token: response.refresh_token,
			token_type: response.token_type,
			expires_at: new Date(expires_at),
		})

		await this.installedAppsService.update({
			installed_app_id: oath.installed_app_id,
			integration_status: AppIntegrationStatus.CONNECTED,
		})

		res.setHeader('Set-Cookie', [`app_amazonseller_state=deleted; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`])
		res.redirect(process.env.AMAZON_SELLER_OAUTH_REDIRECT_URL ?? process.env.BASE_URL_APP)
		return
	}
}
