import { forwardRef, Module } from '@nestjs/common'
import { ScrapingBeeModule } from '../index'
import { SandboxController } from './sandbox.controller'

@Module({
	imports: [forwardRef(() => ScrapingBeeModule)],
	controllers: [SandboxController],
})
export class SandboxModule {}
