import { Module } from '@nestjs/common'
import { EverflowAffiliateReportingConversionsModule } from './affiliate/reporting/conversions/everflow.affiliate.reporting.conversions.module'
import { EverflowAffiliateReportingClicksModule } from './affiliate/reporting/clicks/everflow.affiliate.reporting.clicks.module'
import { EverflowAffiliateOffersModule } from './affiliate/offers/everflow.affiliate.offers.module'
@Module({
	imports: [
		EverflowAffiliateReportingClicksModule,
		EverflowAffiliateReportingConversionsModule,
		EverflowAffiliateOffersModule,
	],
})
export class EverflowModule {}
