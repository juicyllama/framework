import { ConfigValidationModule, getConfigToken } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { createClient } from 'pexels'
import { PexelsConfigDto } from '../configs/pexels.config.dto'
import { PexelsClientToken } from './pexels.constants'
import { PexelsService } from './pexels.service'

@Module({
	imports: [ConfigValidationModule.register(PexelsConfigDto)],
	controllers: [],
	providers: [
		PexelsService,
		Logger,
		{
			provide: PexelsClientToken,
			inject: [getConfigToken(PexelsConfigDto)],
			useFactory: (config: PexelsConfigDto) => {
				return createClient(config.PEXELS_API_KEY)
			},
		},
	],
	exports: [PexelsService],
})
export class PexelsModule {}
