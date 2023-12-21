import { ConfigValidationModule, getConfigToken } from '@juicyllama/core'
import { Api, Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { WordpressConfigDto } from '../../config/wordpress.config.dto'
import { WordpressUsersUrlToken } from './wordpress.users.constants'
import { WordpressUsersService } from './wordpress.users.service'

@Module({
	imports: [ConfigValidationModule.register(WordpressConfigDto)],
	providers: [
		WordpressUsersService,
		Logger,
		Api,
		{
			provide: WordpressUsersUrlToken,
			inject: [getConfigToken(WordpressConfigDto)],
			useFactory: (config: WordpressConfigDto) => `${config.WORDPRESS_URL}/wp-json/wp/v2/users`,
		},
	],
	exports: [WordpressUsersService],
})
export class WordpressUsersModule {}
