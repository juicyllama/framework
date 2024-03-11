import { InjectConfig } from '@juicyllama/core'
import { Api, Logger } from '@juicyllama/utils'
import { Inject, Injectable, forwardRef } from '@nestjs/common'
import querystring from 'querystring'
import { SemrushConfigDto } from '../../configs/semrush.config.dto'
import { ENDPOINT } from '../../utils/constants'
import { AuthorityScoreParams, BacklinksOverviewParams } from '../../utils/intefaces'
import { parseTextData } from '../../utils/textToObj'

@Injectable()
export class BacklinksService {
	private key: string | undefined

	constructor(
		@Inject(forwardRef(() => Api)) private readonly api: Api,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@InjectConfig(SemrushConfigDto) private readonly configService: SemrushConfigDto,
	) {
		this.key = this.configService.SEMRUSH_API_KEY
	}

	async authorityScore(queryParams: Partial<AuthorityScoreParams>) {
		const domain = 'app::semrush::backlinks::authorityScore'

		const qs = querystring.stringify(queryParams)

		try {
			const response = await this.api.get(
				domain,
				`${ENDPOINT}/analytics/v1/?key=${this.key}&type=backlinks_ascore_profile&${qs}`,
			)

			return parseTextData(response)
		} catch (err) {
			const e = err as Error
			this.logger.error(`[${domain}] Error finding offers: ${e.message}`, e)
			throw e
		}
	}

	async overview(queryParams: Partial<BacklinksOverviewParams>) {
		const domain = 'app::semrush::backlinks::overview'
		const qs = querystring.stringify(queryParams)
		try {
			const response = await this.api.get(
				domain,
				`${ENDPOINT}/analytics/v1/?key=${this.key}&type=backlinks_overview&${qs}`,
			)
			return parseTextData(response)
		} catch (err) {
			const e = err as Error
			this.logger.error(`[${domain}] Error finding offers: ${e.message}`, e)
			throw e
		}
	}
}
