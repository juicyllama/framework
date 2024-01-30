import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Query } from '../../utils/typeorm/Query'
import { AuthModule } from '../auth/auth.module'
import { BeaconModule } from '../beacon/beacon.module'
import { Tag } from './tags.entity'
import { TagsService } from './tags.service'

@Module({
	imports: [TypeOrmModule.forFeature([Tag]), AuthModule, BeaconModule],
	controllers: [],
	providers: [TagsService, Query],
	exports: [TagsService],
})
export class TagsModule {}
