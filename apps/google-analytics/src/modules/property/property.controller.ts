import { Controller, Post, Body, Query, BadRequestException } from '@nestjs/common'

import { Logger } from '@juicyllama/utils'
import { InstalledAppsService } from '@juicyllama/app-store'

import { GoogleAnalyticsApp } from '../google-analytics.app'
import { PropertyService } from './property.service'
import { PropertyInstalledApp } from './property-app.entity'

@Controller(GoogleAnalyticsApp.createRoute('/property'))
export class PropertyController {
	constructor(
		private readonly logger: Logger,
		private readonly installedAppsService: InstalledAppsService,
		private readonly propertyService: PropertyService,
	) {}

	@Post('run-report')
	async runReport(@Query('installed_app_id') installedAppId: number, @Body() payload: Object) {
		const domain = 'app::google-analytics::property::controller::run-report'

		const app = await this.loadInstalledApp(installedAppId, domain)

		return await this.propertyService.runReport(app, payload)
	}

	private async loadInstalledApp(id: number, domain: string): Promise<PropertyInstalledApp> {
		const app = await this.installedAppsService.findOne({
			where: { installed_app_id: id },
		})

		if (!app) {
			this.logger.error(`[${domain}] Authentication Error: Installed App not found`, {
				installed_app_id: id,
			})
			throw new BadRequestException(`Authentication Error: Installed App not found`)
		}

		return app as PropertyInstalledApp
	}
}
