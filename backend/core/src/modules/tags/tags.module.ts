import { Module } from '@nestjs/common'
import { CacheModule } from '@nestjs/cache-manager'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Tag } from './tags.entity.js'
import { TagsService } from './tags.service.js'
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
		TypeOrmModule.forFeature([Tag]),
	],
	controllers: [],
	providers: [TagsService, Query],
	exports: [TagsService],
})
export class TagsModule {}
