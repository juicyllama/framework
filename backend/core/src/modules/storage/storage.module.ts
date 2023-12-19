import { Module } from '@nestjs/common'
import { StorageService } from './storage.service'
import { Logger } from '@juicyllama/utils'
import { Query } from '../../utils/typeorm/Query'

@Module({
	imports: [],
	providers: [StorageService, Logger, Query],
	exports: [StorageService],
})
export class StorageModule {}
