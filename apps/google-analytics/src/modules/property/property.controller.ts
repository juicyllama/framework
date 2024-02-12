import { Controller, Post, Body, Query } from '@nestjs/common'

import { AccountId, UserAuth } from '@juicyllama/core'

import { PropertyService } from './property.service'
import { GoogleAnalyticsInstalledAppService } from '../google-analytics-installed-app/google-analytics-installed-app.service'
import { GoogleAnalyticsBaseController } from '../google-analytics.base-controller'

@UserAuth()
@Controller('/property')
export class PropertyController extends GoogleAnalyticsBaseController {
	public constructor(
		gaInstalledAppService: GoogleAnalyticsInstalledAppService,
		private readonly propertyService: PropertyService,
	) {
		super(gaInstalledAppService)
	}

	@Post('run-report')
	public async runReport(
		@AccountId() accountId: number,
		@Query('installed_app_id') installedAppId: number,
		@Body() payload: Object,
	) {
		const app = await this.loadInstalledApp(installedAppId, accountId)

		return this.propertyService.runReport(app, payload)
	}
}
