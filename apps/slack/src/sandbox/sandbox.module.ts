import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SlackModule } from '../index'
import { SandboxController } from './sandbox.controller'

@Module({
	imports: [ConfigModule.forRoot(), SlackModule],
	controllers: [SandboxController],
})
export class SandboxModule {}
