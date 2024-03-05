import { ConfigValidationModule } from '@juicyllama/core'
import { Api, Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { ApilayerConfigDto } from '../../config/apilayer.config.dto'
import { NumberVerificationService } from './number.verification.service'

@Module({
	imports: [ConfigValidationModule.register(ApilayerConfigDto)],
	controllers: [],
	providers: [NumberVerificationService, Logger, Api],
	exports: [NumberVerificationService],
})
export class NumberVerificationModule {}
