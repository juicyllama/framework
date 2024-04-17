import { Module } from '@nestjs/common'
import { Api, Logger } from '@juicyllama/utils'
import { KombatService } from './kombat.service'
import { ConfigValidationModule } from '@juicyllama/core'
import { SpyfuConfigDto } from '../../configs/spyfu.config.dto'

@Module({
	imports: [ConfigValidationModule.register(SpyfuConfigDto)],
	providers: [KombatService, Api, Logger],
	exports: [KombatService],
})
export class KombatModule {}
