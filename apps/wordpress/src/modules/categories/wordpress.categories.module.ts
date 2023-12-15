import { Module } from '@nestjs/common'
import { Api, Logger } from '@juicyllama/utils'
import { WordpressCategoriesService } from './wordpress.categories.service'

@Module({
	providers: [WordpressCategoriesService, Logger, Api],
	exports: [WordpressCategoriesService],
})
export class WordpressCategoriesModule {}
