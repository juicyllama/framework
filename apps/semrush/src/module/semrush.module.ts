import { forwardRef, Module } from '@nestjs/common'
import {ConfigModule} from "@nestjs/config"
import Joi from 'joi'
import { Api, Env, Logger } from '@juicyllama/utils'
import { DomainReportModule } from './domainreport/domainreport.module'
import { DomainReportService } from './domainreport/domainreport.service'
import semrushConfig from '../configs/semrush.config'
import { semrushConfigJoi } from '../configs/semrush.config.joi'
import { BacklinksModule } from './backlinks/backlinks.module'
import { BacklinksService } from './backlinks/backlinks.service'

@Module({
	imports: [ConfigModule.forRoot({
        isGlobal: true,
        load: [semrushConfig],
        validationSchema: Env.IsNotTest() ? Joi.object(semrushConfigJoi) : null,
    }),forwardRef(() => DomainReportModule), forwardRef(() => BacklinksModule)],
	controllers: [],
	providers: [DomainReportService,BacklinksService,Logger, Api],
	exports: [DomainReportService, BacklinksService],
})
export class SemrushModule {}
