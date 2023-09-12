import { forwardRef, Module } from '@nestjs/common'
import { EverflowModule } from '../modules/everflow.module'

@Module({
	imports: [forwardRef(() => EverflowModule)],
})
export class SandboxModule {}
