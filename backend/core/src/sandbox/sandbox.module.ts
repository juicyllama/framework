import { forwardRef, Module } from '@nestjs/common'
import { CoreModule } from '../index.js'

@Module({
	imports: [forwardRef(() => CoreModule)],
})
export class SandboxModule {}
