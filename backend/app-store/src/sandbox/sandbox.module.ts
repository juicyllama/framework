import { forwardRef, Module } from '@nestjs/common'
import { AppsModule } from '../index'

@Module({
	imports: [forwardRef(() => AppsModule)],
})
export class SandboxModule {}
