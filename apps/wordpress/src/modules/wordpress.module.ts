import { forwardRef, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Env } from '@juicyllama/utils'
import Joi from 'joi'
import wordpressConfig from '../config/wordpress.config'
import { wordpressConfigJoi } from '../config/wordpress.config.joi'
import { WordpressPostsModule } from './posts/wordpress.posts.module'
import { WordpressUsersModule } from './users/wordpress.users.module'
import { WordpressCategoriesModule } from './categories/wordpress.categories.module'
import { WordpressMediaModule } from './media/wordpress.media.module'
import { WordpressInstallationService } from './wordpress.installation'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [wordpressConfig],
			validationSchema: Env.IsNotTest() ? Joi.object(wordpressConfigJoi) : null,
		}),
		forwardRef(() => WordpressPostsModule),
		forwardRef(() => WordpressUsersModule),
		forwardRef(() => WordpressCategoriesModule),
		forwardRef(() => WordpressMediaModule),
	],
	providers: [WordpressInstallationService]
})
export class WordpressModule {}
