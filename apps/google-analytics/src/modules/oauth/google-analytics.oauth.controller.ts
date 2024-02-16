import { BadRequestException, Controller, Get, ParseIntPipe, Query } from '@nestjs/common'

import { AccountId, UserAuth } from '@juicyllama/core'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

import { GoogleAnalyticsInstalledAppService } from '../installed-app/google-analytics.installed-app.service'

import { GoogleAnalyticsOAuthService } from './google-analytics.oauth.service'
import { GoogleAnalyticsInstalledAppOAuthService } from './google-analytics.installed-app-oauth.service'
import { GoogleAnalyticsBaseController } from '../google-analytics.base-controller'
import { GoogleAnalyticsApp } from '../google-analytics.app'

@ApiTags(GoogleAnalyticsApp.createApiSubTag('oAuth'))
@Controller('/oauth')
export class GoogleAnalyticsOAuthController extends GoogleAnalyticsBaseController {
	constructor(
		gaInstalledAppService: GoogleAnalyticsInstalledAppService,
		private readonly authService: GoogleAnalyticsOAuthService,
		private readonly installedAppAuthService: GoogleAnalyticsInstalledAppOAuthService,
	) {
		super(gaInstalledAppService)
	}

	@ApiOperation({ description: 'Initiates oAuth flow to authenticate installed application via Google oAuth' })
	@ApiOkResponse({
		description: 'Google oAuth consent link URL',
		schema: {
			type: 'object',
			properties: { redirect_url: { type: 'string' } },
		},
	})
	@UserAuth()
	@Get('/init')
	public async init(
		@Query('installed_app_id', new ParseIntPipe()) installedAppId: number,
		@AccountId() accountId: number,
	) {
		const oauth = this.authService.generateAuthUrl()
		const installedApp = await this.loadInstalledApp(installedAppId, accountId)

		await this.installedAppAuthService.initOauth(installedApp, oauth)

		return { redirect_url: oauth.authUrl }
	}

	@ApiOperation({
		description:
			'Completes oAuth flow to authenticate installed application via Google oAuth. Google will redirect here after the consent screen',
	})
	@ApiOkResponse({
		description: 'Success message',
		schema: {
			type: 'object',
			properties: { success: { type: 'boolean', example: true } },
		},
	})
	@Get('/callback')
	public async callback(@Query('state') state: string, @Query('code') code: string) {
		try {
			const tokens = await this.authService.getTokensFromCallbackCode(code)

			const oauth = await this.installedAppAuthService.storeOauth(state, tokens)

			await this.gaInstalledAppService.recordConnected({ installed_app_id: oauth.installed_app_id })

			return { success: true }
		} catch (e) {
			if (e instanceof GoogleAnalyticsInstalledAppOAuthService.OAuthNotFoundException) {
				throw new BadRequestException('Invalid Oauth State, please ensure you are connecting from the app.')
			}

			throw e
		}
	}
}
