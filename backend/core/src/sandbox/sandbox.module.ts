import { forwardRef, Module } from '@nestjs/common'
import { CoreModule } from '../modules/core.module'

@Module({
	imports: [forwardRef(() => CoreModule)],
})
export class SandboxModule {}
