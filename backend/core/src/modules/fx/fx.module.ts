import { Module } from '@nestjs/common'
import { CacheModule } from '@nestjs/cache-manager'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FxRate } from './fx.entity.js'
import { FxService } from './fx.service.js'
import { Logger } from '@juicyllama/utils'
import cacheConfig from '../../configs/cache.config.js'
import { ConfigModule } from '@nestjs/config'
import { Query } from '../../utils/typeorm/Query.js'

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [cacheConfig],
			isGlobal: true,
			envFilePath: '.env',
		}),
		CacheModule.registerAsync(cacheConfig()),
		TypeOrmModule.forFeature([FxRate]),
	],
	providers: [FxService, Logger, Query],
	exports: [FxService],
})
export class FxModule {}
