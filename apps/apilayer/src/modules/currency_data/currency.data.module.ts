import { ConfigValidationModule } from '@juicyllama/core'
import { Api, Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ApilayerConfigDto } from '../../config/apilayer.config.dto'
import { CurrencyDataService } from './currency.data.service'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		ConfigValidationModule.register(ApilayerConfigDto),
	],
	controllers: [],
	providers: [CurrencyDataService, Logger, Api],
	exports: [CurrencyDataService],
})
export class CurrencyDataModule {}
