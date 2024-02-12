import { Credentials } from 'google-auth-library'

import { Injectable } from '@nestjs/common'
import { OauthService } from '@juicyllama/app-store'

import { InstalledAppLocator } from '../property/property-app.entity'

@Injectable()
export class InstalledAppAuthService {
	public static readonly OauthNotFoundException = class OauthNotFoundException extends Error {}

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
		const oauth = await this.oauthService.findOne({ where: { state } })

		if (!oauth) {
			throw new InstalledAppAuthService.OauthNotFoundException()
		}

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
		const oauth = await this.oauthService.findOne({ where: { installed_app_id: installedApp.installed_app_id } })

		if (!oauth) {
			throw new InstalledAppAuthService.OauthNotFoundException()
		}

		return {
			refresh_token: oauth.refresh_token,
			expiry_date: oauth.expires_at.valueOf(),
			access_token: oauth.access_token,
			token_type: oauth.token_type,
			scope: oauth.scope,
		}
	}
}
