import { ConfigValidationModule, databaseConfig } from '@juicyllama/core'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AhrefsConfigDto } from '../config/ahrefs.config.dto'
import { AhrefsModule } from '../modules/ahrefs.module'

@Module({
	imports: [
		AhrefsModule,
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		ConfigValidationModule.register(AhrefsConfigDto),
		TypeOrmModule.forRoot(databaseConfig()),
		ScheduleModule.forRoot(),
	],
})
export class SandboxModule {}
