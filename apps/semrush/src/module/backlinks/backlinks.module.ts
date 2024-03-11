import { Module } from '@nestjs/common'
import { BacklinksService } from './backlinks.service'
import { Api, Logger } from '@juicyllama/utils'

@Module({
	providers: [BacklinksService, Api, Logger],
	exports: [BacklinksService],
})
export class BacklinksModule {}
