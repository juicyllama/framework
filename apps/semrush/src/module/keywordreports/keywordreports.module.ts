import { Module } from '@nestjs/common'
import { Api, Logger } from '@juicyllama/utils'
import { KeywordReportsService } from './keywordreports.service'

@Module({
	providers: [KeywordReportsService, Api, Logger],
	exports: [KeywordReportsService],
})
export class KeywordReportsModule {}
