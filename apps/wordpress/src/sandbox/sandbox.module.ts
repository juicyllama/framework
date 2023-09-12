import { forwardRef, Module } from '@nestjs/common'
import { WordpressModule } from '../modules/wordpress.module'

@Module({
	imports: [forwardRef(() => WordpressModule)],
})
export class SandboxModule {}
