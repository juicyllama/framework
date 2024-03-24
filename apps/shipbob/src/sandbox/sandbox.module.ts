import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ShipbobModule } from '../modules/shipbob.module'

@Module({
	imports: [ConfigModule.forRoot(), ShipbobModule],
})
export class SandboxModule {}
