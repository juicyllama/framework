import { BadRequestException, Controller, Get, NotFoundException, ParseIntPipe, Query } from '@nestjs/common'

import { GoogleAnalyticsApp } from '../google-analytics.app'
import { AuthService } from './auth.service'
import { InstalledAppAuthService } from './installed-app-auth.service'

@Controller(GoogleAnalyticsApp.createRoute('/auth'))
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly installedAppAuthService: InstalledAppAuthService,
	) {}

	@Get('/init')
	public async init(
		@Query('installed_app_id', new ParseIntPipe()) installedAppId: number,
		@Query('account_id', new ParseIntPipe()) accountId: number,
	) {
		try {
			const oauth = this.authService.generateAuthUrl()
			const installedApp = await this.installedAppAuthService.loadInstalledApp(installedAppId, accountId)

			await this.installedAppAuthService.initOauth(installedApp, oauth)

			return { redirect_url: oauth.authUrl }
		} catch (e) {
			if (e instanceof InstalledAppAuthService.AppNotFoundException) {
				throw new NotFoundException(`Installed App ${installedAppId} not found`)
			}

			if (e instanceof InstalledAppAuthService.AppNotConfiguredException) {
				throw new BadRequestException(`Google Analytics Property ID not found in App settings`)
			}

			throw e
		}
	}

	@Get('/callback')
	public async callback(@Query('state') state: string, @Query('code') code: string) {
		try {
			const tokens = await this.authService.getTokensFromCallbackCode(code)

			const oauth = await this.installedAppAuthService.storeOauth(state, tokens)

			await this.installedAppAuthService.recordInstalledAppConnected({
				installed_app_id: oauth.installed_app_id,
			})

			return { success: true }
		} catch (e) {
			if (e instanceof InstalledAppAuthService.OauthNotFoundException) {
				throw new BadRequestException('Invalid Oauth State, please ensure you are connecting from the app.')
			}

			throw e
		}
	}
}
