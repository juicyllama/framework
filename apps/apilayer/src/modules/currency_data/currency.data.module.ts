import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Api, Env, Logger } from '@juicyllama/utils'
import Joi from 'joi'
import apilayerConfig from '../../config/apilayer.config'
import { apilayerConfigJoi } from '../../config/apilayer.config.joi'
import { CurrencyDataService } from './currency.data.service'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [apilayerConfig],
			validationSchema: Env.IsNotTest() ? Joi.object(apilayerConfigJoi) : null,
		}),
	],
	controllers: [],
	providers: [CurrencyDataService, Logger, Api],
	exports: [CurrencyDataService],
})
export class CurrencyDataModule {}
