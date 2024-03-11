import { Module } from '@nestjs/common'
import { Api, Logger } from '@juicyllama/utils'
import { KeywordsService } from './keywords.service'

@Module({
	providers: [KeywordsService, Api, Logger],
	exports: [KeywordsService],
})
export class KeywordssModule {}
