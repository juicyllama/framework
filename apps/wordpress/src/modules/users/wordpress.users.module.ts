import { Module } from '@nestjs/common'
import { Api, Logger } from '@juicyllama/utils'
import { WordpressUsersService } from './wordpress.users.service'

@Module({
	providers: [WordpressUsersService, Logger, Api],
	exports: [WordpressUsersService],
})
export class WordpressUsersModule {}
