import { ConfigValidationModule } from '@juicyllama/core'
import { Api, Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { ApilayerConfigDto } from '../../config/apilayer.config.dto'
import { CurrencyDataService } from './currency.data.service'

@Module({
	imports: [ConfigValidationModule.register(ApilayerConfigDto)],
	controllers: [],
	providers: [CurrencyDataService, Logger, Api],
	exports: [CurrencyDataService],
})
export class CurrencyDataModule {}
