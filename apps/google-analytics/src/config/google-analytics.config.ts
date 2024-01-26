import { BetaAnalyticsDataClient } from '@google-analytics/data';

import { GoogleAnalyticsConfigDto } from './google-analytics.config.dto'

export function AnalyticsClientFactory(config: GoogleAnalyticsConfigDto): BetaAnalyticsDataClient {
	return new BetaAnalyticsDataClient()
}
