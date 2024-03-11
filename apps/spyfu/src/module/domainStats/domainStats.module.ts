import { Module } from '@nestjs/common'
import { Api, Logger } from '@juicyllama/utils'
import { DomainStatsService } from './domainStats.service'

@Module({
	providers: [DomainStatsService, Api, Logger],
	exports: [DomainStatsService],
})
export class DomainStatsModule {}
