import { Module } from '@nestjs/common'
import { Api, Logger } from '@juicyllama/utils'
import { DomainStatsService } from './domainStats.service'
import { ConfigValidationModule } from '@juicyllama/core'
import { SpyfuConfigDto } from '../../configs/spyfu.config.dto'

@Module({
	imports: [ConfigValidationModule.register(SpyfuConfigDto)],
	providers: [DomainStatsService, Api, Logger],
	exports: [DomainStatsService],
})
export class DomainStatsModule {}
