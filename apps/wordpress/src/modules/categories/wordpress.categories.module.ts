import { ConfigValidationModule, getConfigToken } from '@juicyllama/core'
import { Api, Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { WordpressConfigDto } from '../../config/wordpress.config.dto'
import { WordpressCategoriesUrlToken } from './wordpress.categories.constants'
import { WordpressCategoriesService } from './wordpress.categories.service'

@Module({
	imports: [ConfigValidationModule.register(WordpressConfigDto)],
	providers: [
		WordpressCategoriesService,
		Logger,
		Api,
		{
			provide: WordpressCategoriesUrlToken,
			inject: [getConfigToken(WordpressConfigDto)],
			useFactory: (config: WordpressConfigDto) => `${config.WORDPRESS_URL}/wp-json/wp/v2/categories`,
		},
	],
	exports: [WordpressCategoriesService],
})
export class WordpressCategoriesModule {}
