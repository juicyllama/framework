import { forwardRef, Module } from '@nestjs/common'
import { ChatModule } from './modules/chat/chat.module'

@Module({
	imports: [forwardRef(() => ChatModule)],
})
export class SocialModule {}
