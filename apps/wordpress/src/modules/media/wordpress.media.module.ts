import { ConfigValidationModule, getConfigToken } from '@juicyllama/core'
import { Api, Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { WordpressConfigDto } from '../../config/wordpress.config.dto'
import { WordpressMediaUrlToken } from './wordpress.media.constants'
import { WordpressMediaService } from './wordpress.media.service'

@Module({
	imports: [ConfigValidationModule.register(WordpressConfigDto)],
	providers: [
		WordpressMediaService,
		Logger,
		Api,
		{
			provide: WordpressMediaUrlToken,
			inject: [getConfigToken(WordpressConfigDto)],
			useFactory: (config: WordpressConfigDto) => `${config.WORDPRESS_URL}/wp-json/wp/v2/media`,
		},
	],
	exports: [WordpressMediaService],
})
export class WordpressMediaModule {}
