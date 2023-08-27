import { Module } from '@nestjs/common'
import { CacheModule } from '@nestjs/cache-manager'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Tag } from './tags.entity'
import { TagsService } from './tags.service'
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
		TypeOrmModule.forFeature([Tag]),
	],
	controllers: [],
	providers: [TagsService, Query],
	exports: [TagsService],
})
export class TagsModule {}
