import { ConfigValidationModule } from '@juicyllama/core'
import { Api, Logger } from '@juicyllama/utils'
import { forwardRef, Module } from '@nestjs/common'
import { SpyfuConfigDto } from '../configs/spyfu.config.dto'
import { CompetitorsModule } from './competitors/competitors.module'
import { CompetitorsService } from './competitors/competitors.service'
import { DomainStatsModule } from './domainStats/domainStats.module'
import { DomainStatsService } from './domainStats/domainStats.service'
import { KeywordssModule } from './keywords/keywords.module'
import { KeywordsService } from './keywords/keywords.service'
import { KombatModule } from './kombat/kombat.module'
import { KombatService } from './kombat/kombat.service'

@Module({
	imports: [
		ConfigValidationModule.register(SpyfuConfigDto),
		forwardRef(() => CompetitorsModule),
		forwardRef(() => DomainStatsModule),
		forwardRef(() => KombatModule),
		forwardRef(() => KeywordssModule),
	],
	controllers: [],
	providers: [CompetitorsService, DomainStatsService, KombatService, KeywordsService, Logger, Api],
	exports: [CompetitorsService, DomainStatsService, KombatService, KeywordsService],
})
export class SpyfuModule {}
