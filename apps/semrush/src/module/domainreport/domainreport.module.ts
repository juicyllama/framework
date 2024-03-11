import { Module } from '@nestjs/common'
import { DomainReportService } from './domainreport.service'
import { Api, Logger } from '@juicyllama/utils'

@Module({
	providers: [DomainReportService, Api, Logger],
	exports: [DomainReportService],
})
export class DomainReportModule {}
