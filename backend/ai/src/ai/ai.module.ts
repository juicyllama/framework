import { AiService } from './ai.service.js'
import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { databaseConfig, Query } from '@juicyllama/core'
import { Ai } from './ai.entity.js'
import { AiController } from './ai.controller.js'

@Module({
	imports: [TypeOrmModule.forRoot(databaseConfig()), TypeOrmModule.forFeature([Ai])],
	controllers: [AiController],
	providers: [AiService, Logger, Query],
	exports: [AiService],
})
export class AiModule {}
