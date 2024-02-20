import { ConfigValidationModule } from '@juicyllama/core'
import { Api, Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ApilayerConfigDto } from '../../config/apilayer.config.dto'
import { NumberVerificationService } from './number.verification.service'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		ConfigValidationModule.register(ApilayerConfigDto),
	],
	controllers: [],
	providers: [NumberVerificationService, Logger, Api],
	exports: [NumberVerificationService],
})
export class NumberVerificationModule {}
