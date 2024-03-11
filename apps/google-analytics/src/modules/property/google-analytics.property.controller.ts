import { Controller, Post, Body, Query } from '@nestjs/common'
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

import { AccountId, UserAuth } from '@juicyllama/core'

import { GoogleAnalyticsPropertyService } from './google-analytics.property.service'
import { GoogleAnalyticsInstalledAppService } from '../installed-app/google-analytics.installed-app.service'
import { GoogleAnalyticsBaseController } from '../google-analytics.base-controller'
import { GoogleAnalyticsApp } from '../google-analytics.app'

@UserAuth()
@ApiTags(GoogleAnalyticsApp.createApiSubTag('Property'))
@Controller('/property')
export class GoogleAnalyticsPropertyController extends GoogleAnalyticsBaseController {
	public constructor(
		gaInstalledAppService: GoogleAnalyticsInstalledAppService,
		private readonly propertyService: GoogleAnalyticsPropertyService,
	) {
		super(gaInstalledAppService)
	}

	@ApiOperation({ description: 'Proxy request to Google Analytics Data API runReport endpoint' })
	@ApiBody({
		description: 'runReport payload body without `property` attribute',
		schema: {
			type: 'object',
			example: {
				dateRanges: [
					{
						startDate: '2020-03-31',
						endDate: 'today',
					},
				],
				dimensions: [
					{
						name: 'city',
					},
				],
				metrics: [
					{
						name: 'activeUsers',
					},
				],
			},
		},
	})
	@ApiCreatedResponse({ description: 'Raw response from Google Analytics Data API runReport' })
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
