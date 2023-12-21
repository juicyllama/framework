import { AppsModule } from '@juicyllama/app-store'
import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { WordpressCategoriesModule } from './categories/wordpress.categories.module'
import { WordpressMediaModule } from './media/wordpress.media.module'
import { WordpressPostsModule } from './posts/wordpress.posts.module'
import { WordpressUsersModule } from './users/wordpress.users.module'
import { WordpressInstallationService } from './wordpress.installation'

@Module({
	imports: [AppsModule, WordpressPostsModule, WordpressUsersModule, WordpressCategoriesModule, WordpressMediaModule],
	providers: [WordpressInstallationService, Logger],
})
export class WordpressModule {}
