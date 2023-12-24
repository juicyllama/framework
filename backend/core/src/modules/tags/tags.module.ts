import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Tag } from './tags.entity'
import { TagsService } from './tags.service'
import { Query } from '../../utils/typeorm/Query'
import { AuthModule } from '../auth/auth.module'
import { BeaconModule } from '../beacon/beacon.module'

@Module({
	imports: [TypeOrmModule.forFeature([Tag]), forwardRef(() => AuthModule), forwardRef(() => BeaconModule)],
	controllers: [],
	providers: [TagsService, Query],
	exports: [TagsService],
})
export class TagsModule {}
