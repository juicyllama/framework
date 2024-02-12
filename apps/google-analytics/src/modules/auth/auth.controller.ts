import { BadRequestException, Controller, Get, ParseIntPipe, Query } from '@nestjs/common'

import { AccountId, UserAuth } from '@juicyllama/core'

import { GoogleAnalyticsInstalledAppService } from '../google-analytics-installed-app/google-analytics-installed-app.service'

import { AuthService } from './auth.service'
import { InstalledAppAuthService } from './installed-app-auth.service'
import { GoogleAnalyticsBaseController } from '../google-analytics.base-controller'

@Controller('/auth')
export class AuthController extends GoogleAnalyticsBaseController {
	constructor(
		gaInstalledAppService: GoogleAnalyticsInstalledAppService,
		private readonly authService: AuthService,
		private readonly installedAppAuthService: InstalledAppAuthService,
	) {
		super(gaInstalledAppService)
	}

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

	@Get('/callback')
	public async callback(@Query('state') state: string, @Query('code') code: string) {
		try {
			const tokens = await this.authService.getTokensFromCallbackCode(code)

			const oauth = await this.installedAppAuthService.storeOauth(state, tokens)

			await this.gaInstalledAppService.recordConnected({ installed_app_id: oauth.installed_app_id })

			return { success: true }
		} catch (e) {
			if (e instanceof InstalledAppAuthService.OauthNotFoundException) {
				throw new BadRequestException('Invalid Oauth State, please ensure you are connecting from the app.')
			}

			throw e
		}
	}
}
