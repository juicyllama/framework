import { AuthModule, Query } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AiController } from './ai.controller'
import { Ai } from './ai.entity'
import { AiService } from './ai.service'

@Module({
	imports: [TypeOrmModule.forFeature([Ai]), forwardRef(() => AuthModule)],
	controllers: [AiController],
	providers: [AiService, Logger, Query],
	exports: [AiService],
})
export class AiModule {}
