import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Tag } from './tags.entity.js'
import { TagsService } from './tags.service.js'
import { Query } from '../../utils/typeorm/Query.js'
import { AuthModule } from '../auth/auth.module.js'
import { BeaconModule } from '../beacon/beacon.module.js'

@Module({
	imports: [TypeOrmModule.forFeature([Tag]), forwardRef(() => AuthModule), forwardRef(() => BeaconModule)],
	controllers: [],
	providers: [TagsService, Query],
	exports: [TagsService],
})
export class TagsModule {}
