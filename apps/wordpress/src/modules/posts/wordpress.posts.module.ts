import { Module } from '@nestjs/common'
import { Api, Logger } from '@juicyllama/utils'
import { WordpressPostsService } from './wordpress.posts.service'

@Module({
	providers: [WordpressPostsService, Logger, Api],
	exports: [WordpressPostsService],
})
export class WordpressPostsModule {}
