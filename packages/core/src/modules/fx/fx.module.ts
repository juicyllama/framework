import { CacheModule, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FxRate } from './fx.entity'
import { FxService } from './fx.service'
import { Logger } from '@juicyllama/utils'
import cacheConfig from '../../configs/cache.config'
import { ConfigModule } from '@nestjs/config'
import { Query } from '../../utils/typeorm/Query'

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
