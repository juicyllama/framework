import { Module } from '@nestjs/common'
import { Api, Logger } from '@juicyllama/utils'
import { CompetitorsService } from './competitors.service'

@Module({
	providers: [CompetitorsService, Api, Logger],
	exports: [CompetitorsService],
})
export class CompetitorsModule {}
