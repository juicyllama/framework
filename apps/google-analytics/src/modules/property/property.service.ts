import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { Injectable } from '@nestjs/common';

import { InjectGoogleAnalytics } from '../provider/provider.constants';
import { PropertyInstalledApp } from './property-app.entity';

@Injectable()
export class PropertyService {
	constructor(@InjectGoogleAnalytics() private readonly api: BetaAnalyticsDataClient) {}

	async runReport(installedApp: PropertyInstalledApp) {
		const [response] = await this.api.runReport({
			property: `properties/${installedApp.settings.GOOGLE_ANALYTICS_PROPERTY_ID}`,
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
		});

		return response;
	}
}
