import { Module } from '@nestjs/common'
import { Api, Logger } from '@juicyllama/utils'
import { SEOService } from './seo.service'

@Module({
	providers: [SEOService, Api, Logger],
	exports: [SEOService],
})
export class SEOModule {}
