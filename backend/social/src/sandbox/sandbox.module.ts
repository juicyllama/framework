import { forwardRef, Module } from '@nestjs/common'
import { CoreModule } from '@juicyllama/core'
import { SocialModule } from '../social.module'

@Module({
	imports: [forwardRef(() => CoreModule), forwardRef(() => SocialModule)],
})
export class SandboxModule {}
