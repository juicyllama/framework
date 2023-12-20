import { ConfigValidationModule, getConfigToken } from '@juicyllama/core'
import { createMollieClient } from '@mollie/api-client'
import { Module } from '@nestjs/common'
import { MollieConfigDto } from '../../config/mollie.config.dto'
import { MollieClientToken } from './provider.constants'

@Module({
	imports: [ConfigValidationModule.register(MollieConfigDto)],
	providers: [
		{
			provide: MollieClientToken,
			inject: [getConfigToken(MollieConfigDto)],
			useFactory: (config: MollieConfigDto) => createMollieClient({ apiKey: config.MOLLIE_API_KEY }),
		},
	],
})
export class MollieProviderModule {}
