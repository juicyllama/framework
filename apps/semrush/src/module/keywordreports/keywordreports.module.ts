import { Module } from '@nestjs/common'
import { Api, Logger } from '@juicyllama/utils'
import { KeywordReportsService } from './keywordreports.service'
import { ConfigValidationModule } from '@juicyllama/core'
import { SemrushConfigDto } from '../../configs/semrush.config.dto'

@Module({
	imports: [ConfigValidationModule.register(SemrushConfigDto)],
	providers: [KeywordReportsService, Api, Logger],
	exports: [KeywordReportsService],
})
export class KeywordReportsModule {}
