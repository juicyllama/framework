import { Module, forwardRef } from '@nestjs/common'
import { AuthModule, BeaconModule, Query, TagsModule } from '@juicyllama/core'
import { PostsService } from './posts.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PostComplaints } from './complaints/complaints.entity'
import { PostLikes } from './likes/likes.entity'
import { Post } from './posts.entity'
import { PostsComplaintsService } from './complaints/complaints.service'
import { PostsLikesService } from './likes/likes.service'
import { Logger } from '@juicyllama/utils'
import { ConnectionModule } from '../connection/connection.module'
import { PostsController } from './posts.controller'

@Module({
	imports: [
		TypeOrmModule.forFeature([Post, PostComplaints, PostLikes]),
		forwardRef(() => AuthModule),
		forwardRef(() => BeaconModule),
		forwardRef(() => ConnectionModule),
		forwardRef(() => TagsModule),
	],
	controllers: [PostsController],
	providers: [PostsService, PostsComplaintsService, PostsLikesService, Logger, Query],
	exports: [PostsService, PostsComplaintsService, PostsLikesService],
})
export class PostsModule {}
