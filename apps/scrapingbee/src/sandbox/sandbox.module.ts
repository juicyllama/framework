import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScrapingBeeModule } from '../index'
import { SandboxController } from './sandbox.controller'

@Module({
	imports: [ConfigModule.forRoot(), ScrapingBeeModule],
	controllers: [SandboxController],
})
export class SandboxModule {}
