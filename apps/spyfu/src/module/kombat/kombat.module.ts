import { Module } from '@nestjs/common'
import { Api, Logger } from '@juicyllama/utils'
import { KombatService } from './kombat.service'

@Module({
	providers: [KombatService, Api, Logger],
	exports: [KombatService],
})
export class KombatModule {}
