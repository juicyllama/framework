import { InjectConfig } from '@juicyllama/core'
import { Api, Logger } from '@juicyllama/utils'
import { Inject, Injectable, forwardRef } from '@nestjs/common'
import querystring from 'querystring'
import { ENDPOINT } from '../../utils/constants'
import { IKeywordsResearchResponse, KeywordsResearchParams } from '../../utils/intefaces'
import { SpyfuConfigDto } from '../../configs/spyfu.config.dto'

@Injectable()
export class KeywordsService {
	private key: string | undefined

	constructor(
		@Inject(forwardRef(() => Api)) private readonly api: Api,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@InjectConfig(SpyfuConfigDto) private readonly configService: SpyfuConfigDto,
	) {
		this.key = this.configService.SPYFU_API_KEY
	}

	async research(queryParams: Partial<KeywordsResearchParams>): Promise<IKeywordsResearchResponse> {
		const domain = 'app::spyfu::keywords::research'
		const qs = querystring.stringify(queryParams)

		try {
			const response = await this.api.get(
				domain,
				`${ENDPOINT}/keyword_api/v2/related/getKeywordInformation/?api_key=${this.key}&${qs}`,
				{},
			)

			return response
		} catch (err) {
			const e = err as Error
			this.logger.error(`[${domain}] Error finding offers: ${e.message}`, e)
			throw e
		}
	}
}
