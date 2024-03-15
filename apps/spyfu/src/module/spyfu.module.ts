import { forwardRef, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Api, Env, Logger } from '@juicyllama/utils'
import Joi from 'joi'
import spyfuConfig from '../configs/spyfu.config'
import { spyfuConfigJoi } from '../configs/spyfu.config.joi'
import { CompetitorsModule } from './competitors/competitors.module'
import { DomainStatsModule } from './domainStats/domainStats.module'
import { KombatModule } from './kombat/kombat.module'
import { CompetitorsService } from './competitors/competitors.service'
import { DomainStatsService } from './domainStats/domainStats.service'
import { KombatService } from './kombat/kombat.service'
import { KeywordssModule } from './keywords/keywords.module'
import { KeywordsService } from './keywords/keywords.service'
import { SEOModule } from './seo/seo.module'
import { SEOService } from './seo/seo.service'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [spyfuConfig],
			validationSchema: Env.IsNotTest() ? Joi.object(spyfuConfigJoi) : null,
		}),
		forwardRef(() => CompetitorsModule),
		forwardRef(() => DomainStatsModule),
		forwardRef(() => KombatModule),
		forwardRef(() => KeywordssModule),
		forwardRef(() => SEOModule),


	],
	controllers: [],
	providers: [CompetitorsService, DomainStatsService, KombatService,KeywordsService,SEOService ,Logger, Api],
	exports: [CompetitorsService, DomainStatsService, KombatService,KeywordsService, SEOService],
})
export class SpyfuModule {}
