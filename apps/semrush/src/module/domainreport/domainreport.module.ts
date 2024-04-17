import { Module } from '@nestjs/common'
import { DomainReportService } from './domainreport.service'
import { Api, Logger } from '@juicyllama/utils'
import { ConfigValidationModule } from '@juicyllama/core'
import { SemrushConfigDto } from '../../configs/semrush.config.dto'

@Module({
	imports: [ConfigValidationModule.register(SemrushConfigDto)],
	providers: [DomainReportService, Api, Logger],
	exports: [DomainReportService],
})
export class DomainReportModule {}
