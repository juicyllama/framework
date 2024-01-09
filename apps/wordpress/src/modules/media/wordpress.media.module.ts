import { Module } from '@nestjs/common'
import { Api, Logger } from '@juicyllama/utils'
import { WordpressMediaService } from './wordpress.media.service'

@Module({
	providers: [WordpressMediaService, Logger, Api],
	exports: [WordpressMediaService],
})
export class WordpressMediaModule {}
