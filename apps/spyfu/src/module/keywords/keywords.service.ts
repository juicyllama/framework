import { Injectable, Inject, forwardRef } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Api, Logger } from '@juicyllama/utils'
import { ENDPOINT } from '../../utils/constants'
import querystring from 'querystring'
import { IKeywordsResearchResponse, KeywordsResearchParams } from '../../utils/intefaces'

@Injectable()
export class KeywordsService {
	private key: string | undefined

	constructor(
		@Inject(forwardRef(() => Api)) private readonly api: Api,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
	) {
		this.key = this.configService.get<string>('spyfu.SPYFU_API_KEY')
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
