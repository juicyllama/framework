import { Credentials } from 'google-auth-library'

import { Injectable } from '@nestjs/common'
import { OauthService, Oauth } from '@juicyllama/app-store'

import { InstalledAppLocator } from '../property/google-analytics.installed-app.entity'

@Injectable()
export class GoogleAnalyticsInstalledAppOAuthService {
	public static readonly OAuthNotFoundException = class OAuthNotFoundException extends Error {}

	public constructor(private readonly oauthService: OauthService) {}

	public async initOauth(
		installedApp: InstalledAppLocator,
		{
			state,
			authUrl,
		}: {
			state: string
			authUrl: string
		},
	) {
		const oauth = await this.oauthService.findOne({ where: { installed_app_id: installedApp.installed_app_id } })

		const initData = {
			installed_app_id: installedApp.installed_app_id,
			state: state,
			redirect_url: authUrl,
		}

		if (oauth) {
			await this.oauthService.update({ oauth_id: oauth.oauth_id, ...initData })
		} else {
			await this.oauthService.create(initData)
		}
	}

	public async storeOauth(state: string, tokens: Credentials) {
		const oauth = await this.getOauth({ state })

		return this.oauthService.update({
			oauth_id: oauth.oauth_id,
			access_token: tokens.access_token,
			refresh_token: tokens.refresh_token,
			scope: tokens.scope,
			token_type: tokens.token_type,
			expires_at: new Date(tokens.expiry_date),
		})
	}

	public async loadSavedCredentials(installedApp: InstalledAppLocator): Promise<Credentials> {
		const oauth = await this.getOauth({ installed_app_id: installedApp.installed_app_id })

		return {
			refresh_token: oauth.refresh_token,
			expiry_date: oauth.expires_at.valueOf(),
			access_token: oauth.access_token,
			token_type: oauth.token_type,
			scope: oauth.scope,
		}
	}

	private async getOauth(search: Partial<Oauth>) {
		const oauth = await this.oauthService.findOne({ where: search })

		if (!oauth) {
			throw new GoogleAnalyticsInstalledAppOAuthService.OAuthNotFoundException()
		}

		return oauth
	}
}
