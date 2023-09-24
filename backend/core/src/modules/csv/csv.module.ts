import { Module } from '@nestjs/common'
import { Logger } from '@juicyllama/utils'
import cacheConfig from '../../configs/cache.config.js'
import { ConfigModule } from '@nestjs/config'
import { CsvService } from './csv.service.js'

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [cacheConfig],
			isGlobal: true,
			envFilePath: '.env',
		}),
	],
	providers: [CsvService, Logger],
	exports: [CsvService],
})
export class CsvModule {}
