import { forwardRef, Module } from '@nestjs/common'
import { SlackModule } from '../index'
import { SandboxController } from './sandbox.controller'

@Module({
	imports: [forwardRef(() => SlackModule)],
	controllers: [SandboxController],
})
export class SandboxModule {}
