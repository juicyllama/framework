import { databaseConfig } from '@juicyllama/core'
import { Env } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule } from '@nestjs/typeorm'
import ahrefsConfig from '../config/ahrefs.config'
import { ahrefsConfigJoi } from '../config/ahrefs.config.joi'
import { AhrefsModule } from '../modules/ahrefs.module'

@Module({
	imports: [
		AhrefsModule,
		ConfigModule.forRoot({
			isGlobal: true,
			load: [ahrefsConfig],
			validationSchema: Env.IsNotTest() ? ahrefsConfigJoi : null,
		}),
		TypeOrmModule.forRoot(databaseConfig()),
		ScheduleModule.forRoot(),
	],
})
export class SandboxModule {}
