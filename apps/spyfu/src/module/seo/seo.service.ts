import { Injectable, Inject, forwardRef } from '@nestjs/common'
import { Api, Logger } from '@juicyllama/utils'
import { ENDPOINT } from '../../utils/constants'
import querystring from 'querystring'
import { IMostValuableKeywordsResponse, MostValuableKeywordsParams } from '../../utils/intefaces'
import { InjectConfig } from '@juicyllama/core'
import { SpyfuConfigDto } from '../../configs/spyfu.config.dto'

@Injectable()
export class SEOService {
	private key: string | undefined

	constructor(
		@Inject(forwardRef(() => Api)) private readonly api: Api,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@InjectConfig(SpyfuConfigDto) private readonly configService: SpyfuConfigDto,
	) {
		this.key = this.configService.SPYFU_API_KEY
	}

	async mostValuableKeyword(
		queryParams: Partial<MostValuableKeywordsParams>,
	): Promise<IMostValuableKeywordsResponse> {
		const domain = 'app::spyfu::seo::mostValuableKeyword'
		const qs = querystring.stringify(queryParams)

		try {
			const response = await this.api.get(
				domain,
				`${ENDPOINT}/serp_api/v2/seo/getMostValuableKeywords/?api_key=${this.key}&${qs}`,
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
