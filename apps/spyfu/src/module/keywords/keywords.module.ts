import { Module } from '@nestjs/common'
import { Api, Logger } from '@juicyllama/utils'
import { KeywordsService } from './keywords.service'
import { ConfigValidationModule } from '@juicyllama/core'
import { SpyfuConfigDto } from '../../configs/spyfu.config.dto'

@Module({
	imports: [ConfigValidationModule.register(SpyfuConfigDto)],
	providers: [KeywordsService, Api, Logger],
	exports: [KeywordsService],
})
export class KeywordssModule {}
