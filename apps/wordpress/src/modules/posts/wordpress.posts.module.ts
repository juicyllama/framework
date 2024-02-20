import { ConfigValidationModule, getConfigToken } from '@juicyllama/core'
import { Api, Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { WordpressConfigDto } from '../../config/wordpress.config.dto'
import { WordpressPostsUrlToken } from './wordpress.posts.constants'
import { WordpressPostsService } from './wordpress.posts.service'

@Module({
	imports: [ConfigValidationModule.register(WordpressConfigDto)],
	providers: [
		WordpressPostsService,
		Logger,
		Api,
		{
			provide: WordpressPostsUrlToken,
			inject: [getConfigToken(WordpressConfigDto)],
			useFactory: (config: WordpressConfigDto) => `${config.WORDPRESS_URL}/wp-json/wp/v2/posts`,
		},
	],
	exports: [WordpressPostsService],
})
export class WordpressPostsModule {}
