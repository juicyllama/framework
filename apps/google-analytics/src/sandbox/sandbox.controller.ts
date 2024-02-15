import { Controller, Post, Body } from '@nestjs/common'

import { AccountService } from '@juicyllama/core'
import { AppScope, AppsService, AppStoreIntegrationName, InstalledAppsService } from '@juicyllama/app-store'

import { SandboxAppInstallDto } from './sandbox-app-install.dto'

@Controller('sandbox')
export class SandboxController {
	constructor(
		private readonly accountsService: AccountService,
		private readonly appsService: AppsService,
		private readonly installedAppsService: InstalledAppsService,
	) {}

	@Post('install-demo-app')
	async install(@Body() dto: SandboxAppInstallDto) {
		const app = await this.appsService.findOne({ where: { integration_name: AppStoreIntegrationName.ga4 } })
		const account = await this.accountsService.findOne()

		const installedApp = await this.installedAppsService.create({
			app_id: app.app_id,
			name: `GA4: ${dto.propertyId}`,
			scope: AppScope.ACCOUNT,
			account_id: account.account_id,
			settings: {
				GOOGLE_ANALYTICS_PROPERTY_ID: dto.propertyId,
			},
		})

		installedApp.app = app

		return this.installedAppsService.removePrivateSettings(
			await this.installedAppsService.update({
				installed_app_id: installedApp.installed_app_id,
				oauth_redirect_url: await this.installedAppsService.createOauthLink(installedApp),
			}),
		)
	}
}
