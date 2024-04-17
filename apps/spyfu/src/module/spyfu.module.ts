import { ConfigValidationModule } from '@juicyllama/core'
import { Api, Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { SpyfuConfigDto } from '../configs/spyfu.config.dto'
import { CompetitorsModule } from './competitors/competitors.module'
import { CompetitorsService } from './competitors/competitors.service'
import { DomainStatsModule } from './domainStats/domainStats.module'
import { DomainStatsService } from './domainStats/domainStats.service'
import { KeywordssModule } from './keywords/keywords.module'
import { KeywordsService } from './keywords/keywords.service'
import { SEOModule } from './seo/seo.module'
import { SEOService } from './seo/seo.service'
import { KombatModule } from './kombat/kombat.module'
import { KombatService } from './kombat/kombat.service'

@Module({
	imports: [
		ConfigValidationModule.register(SpyfuConfigDto),
		CompetitorsModule,
		DomainStatsModule,
		KombatModule,
		KeywordssModule,
		SEOModule,
	],
	controllers: [],
	providers: [CompetitorsService, DomainStatsService, KombatService, KeywordsService, SEOService, Logger, Api],
	exports: [CompetitorsService, DomainStatsService, KombatService, KeywordsService, SEOService, SEOService],
})
export class SpyfuModule {}
