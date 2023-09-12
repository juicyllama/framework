import { forwardRef, Module } from '@nestjs/common'
import { CoreModule } from '../index'

@Module({
	imports: [forwardRef(() => CoreModule)],
})
export class SandboxModule {}
