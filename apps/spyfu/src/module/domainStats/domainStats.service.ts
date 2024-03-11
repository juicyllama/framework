import { InjectConfig } from '@juicyllama/core'
import { Api, Logger } from '@juicyllama/utils'
import { Inject, Injectable, forwardRef } from '@nestjs/common'
import querystring from 'querystring'
import { SpyfuConfigDto } from '../../configs/spyfu.config.dto'
import { ENDPOINT } from '../../utils/constants'
import { IDomainStatsResponse, LatestDomainStatsParams } from '../../utils/intefaces'

@Injectable()
export class DomainStatsService {
	private key: string | undefined

	constructor(
		@Inject(forwardRef(() => Api)) private readonly api: Api,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@InjectConfig(SpyfuConfigDto) private readonly configService: SpyfuConfigDto,
	) {
		this.key = this.configService.SPYFU_API_KEY
	}

	async latest(queryParams: Partial<LatestDomainStatsParams>): Promise<IDomainStatsResponse> {
		const domain = 'app::spyfu::domainStats::latest'
		const qs = querystring.stringify(queryParams)

		try {
			const response = await this.api.get(
				domain,
				`${ENDPOINT}/domain_stats_api/v2/getLatestDomainStats/?api_key=${this.key}&${qs}`,
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
