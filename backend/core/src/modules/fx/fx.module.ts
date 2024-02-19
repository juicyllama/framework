import { Logger } from '@juicyllama/utils'
import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import cacheConfig from '../../configs/cache.config'
import { Query } from '../../utils/typeorm/Query'
import { FxRate } from './fx.entity'
import { FxService } from './fx.service'

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
