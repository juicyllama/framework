import { forwardRef, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Env, Logger } from '@juicyllama/utils'
import Joi from 'joi'
import wordpressConfig from '../config/wordpress.config'
import { wordpressConfigJoi } from '../config/wordpress.config.joi'
import { WordpressPostsModule } from './posts/wordpress.posts.module'
import { WordpressUsersModule } from './users/wordpress.users.module'
import { WordpressCategoriesModule } from './categories/wordpress.categories.module'
import { WordpressMediaModule } from './media/wordpress.media.module'
import { WordpressInstallationService } from './wordpress.installation'
import { AppsModule } from '@juicyllama/app-store'

@Module({
	//todo move this to provider (as per shopify module)
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [wordpressConfig],
			validationSchema: Env.IsNotTest() ? Joi.object(wordpressConfigJoi) : null,
		}),
		AppsModule,
		WordpressPostsModule,
		WordpressUsersModule,
		WordpressCategoriesModule,
		WordpressMediaModule,
	],
	providers: [WordpressInstallationService, Logger]
})
export class WordpressModule {}
