import { forwardRef, Module } from '@nestjs/common'
import { ChatModule } from './modules/chat/chat.module'
import { ActivityModule } from './modules/activity/activity.module'
import { ConnectionModule } from './modules/connection/connection.module'
import { PointsModule } from './modules/points/points.module'
import { PostsModule } from './modules/posts/posts.module'

@Module({
	imports: [
		forwardRef(() => ActivityModule),
		forwardRef(() => ChatModule),
		forwardRef(() => ConnectionModule),
		forwardRef(() => PointsModule),
		forwardRef(() => PostsModule),
	],
})
export class SocialModule {}
