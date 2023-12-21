import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { WiseModule } from '../index'

@Module({
	imports: [ConfigModule.forRoot(), WiseModule],
})
export class SandboxModule {}
