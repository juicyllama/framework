import { forwardRef, Module } from '@nestjs/common'
import { WiseModule } from '../index'

@Module({
	imports: [forwardRef(() => WiseModule)],
})
export class SandboxModule {}
