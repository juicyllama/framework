import { AuthModule, databaseConfig, Query } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AiController } from './ai.controller'
import { Ai } from './ai.entity'
import { AiService } from './ai.service'

@Module({
	imports: [TypeOrmModule.forRoot(databaseConfig()), TypeOrmModule.forFeature([Ai]), AuthModule],
	controllers: [AiController],
	providers: [AiService, Logger, Query],
	exports: [AiService],
})
export class AiModule {}
