import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { EverflowModule } from '../modules/everflow.module'

@Module({
	imports: [EverflowModule, ConfigModule.forRoot()],
})
export class SandboxModule {}
