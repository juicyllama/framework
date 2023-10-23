import { forwardRef, Module } from '@nestjs/common'
import { CoreModule } from '../src/index'

@Module({
	imports: [forwardRef(() => CoreModule)],
})
export class SandboxModule {}
