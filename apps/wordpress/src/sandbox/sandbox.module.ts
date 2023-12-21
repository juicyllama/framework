import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { WordpressModule } from '../modules/wordpress.module'

@Module({
	imports: [ConfigModule.forRoot(), WordpressModule],
})
export class SandboxModule {}
