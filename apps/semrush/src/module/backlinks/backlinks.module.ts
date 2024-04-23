import { Module } from '@nestjs/common'
import { BacklinksService } from './backlinks.service'
import { Api, Logger } from '@juicyllama/utils'
import { ConfigValidationModule } from '@juicyllama/core'
import { SemrushConfigDto } from '../../configs/semrush.config.dto'

@Module({
	imports: [ConfigValidationModule.register(SemrushConfigDto)],
	providers: [BacklinksService, Api, Logger],
	exports: [BacklinksService],
})
export class BacklinksModule {}
