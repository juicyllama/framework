import { ConfigValidationModule } from '@juicyllama/core'
import { Api, Logger } from '@juicyllama/utils'
import { forwardRef, Module } from '@nestjs/common'
import { SemrushConfigDto } from '../configs/semrush.config.dto'
import { BacklinksModule } from './backlinks/backlinks.module'
import { BacklinksService } from './backlinks/backlinks.service'
import { DomainReportModule } from './domainreport/domainreport.module'
import { DomainReportService } from './domainreport/domainreport.service'
import { KeywordReportsModule } from './keywordreports/keywordreports.module'
import { KeywordReportsService } from './keywordreports/keywordreports.service'

@Module({
	imports: [
		ConfigValidationModule.register(SemrushConfigDto),
		forwardRef(() => DomainReportModule),
		forwardRef(() => BacklinksModule),
		forwardRef(() => KeywordReportsModule),
	],
	controllers: [],
	providers: [DomainReportService, BacklinksService, KeywordReportsService, Logger, Api],
	exports: [DomainReportService, BacklinksService, KeywordReportsService],
})
export class SemrushModule {}
