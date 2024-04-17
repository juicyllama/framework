import { Module } from '@nestjs/common'
import { Api, Logger } from '@juicyllama/utils'
import { CompetitorsService } from './competitors.service'
import { ConfigValidationModule } from '@juicyllama/core'
import { SpyfuConfigDto } from '../../configs/spyfu.config.dto'

@Module({
	imports: [ConfigValidationModule.register(SpyfuConfigDto)],
	providers: [CompetitorsService, Api, Logger],
	exports: [CompetitorsService],
})
export class CompetitorsModule {}
