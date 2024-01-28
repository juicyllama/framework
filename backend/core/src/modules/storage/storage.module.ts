import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { Query } from '../../utils/typeorm/Query'
import { StorageService } from './storage.service'

@Module({
	imports: [],
	providers: [StorageService, Logger, Query],
	exports: [StorageService],
})
export class StorageModule {}
