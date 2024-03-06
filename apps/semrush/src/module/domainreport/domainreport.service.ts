import { InjectConfig } from '@juicyllama/core'
import { Api, Logger } from '@juicyllama/utils'
import { Inject, Injectable, forwardRef } from '@nestjs/common'
import querystring from 'querystring'
import { SemrushConfigDto } from '../../configs/semrush.config.dto'
import { ENDPOINT } from '../../utils/constants'
import {
	CompetitorsInOrganicSearchParams,
	DomainOrganicSearchKeywordsParams,
	DomainVsDomainParams,
} from '../../utils/intefaces'
import { parseTextData } from '../../utils/textToObj'

@Injectable()
export class DomainReportService {
	private key: string | undefined

	constructor(
		@Inject(forwardRef(() => Api)) private readonly api: Api,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@InjectConfig(SemrushConfigDto) private readonly configService: SemrushConfigDto,
	) {
		this.key = this.configService.SEMRUSH_API_KEY
	}

	async domainVsDomain(queryParams: Partial<DomainVsDomainParams>) {
		const domain = 'app::semrush::domainreport::domainVsDomain'

		const qs = querystring.stringify(queryParams)

		try {
			const response = await this.api.get(domain, `${ENDPOINT}/?key=${this.key}&type=domain_domains&${qs}`)

			console.log(response)

			return parseTextData(response)
		} catch (err) {
			const e = err as Error
			this.logger.error(`[${domain}] Error finding offers: ${e.message}`, e)
			throw e
		}
	}

	async domainOrganicSearchKeywords(queryParams: Partial<DomainOrganicSearchKeywordsParams>) {
		const domain = 'app::semrush::domainreport::domainOrganicSearchKeywords'

		const qs = querystring.stringify(queryParams)

		try {
			const response = await this.api.get(domain, `${ENDPOINT}/?key=${this.key}&type=domain_organic&${qs}`)

			return parseTextData(response)
		} catch (err) {
			const e = err as Error
			this.logger.error(`[${domain}] Error finding offers: ${e.message}`, e)
			throw e
		}
	}

	async competitorsInOrganicSearch(queryParams: Partial<CompetitorsInOrganicSearchParams>) {
		const domain = 'app::semrush::domainreport::competitorsInOrganicSearch'

		const qs = querystring.stringify(queryParams)

		try {
			const response = await this.api.get(
				domain,
				`${ENDPOINT}/?key=${this.key}&type=domain_organic_organic&${qs}`,
			)

			return parseTextData(response)
		} catch (err) {
			const e = err as Error
			this.logger.error(`[${domain}] Error finding offers: ${e.message}`, e)
			throw e
		}
	}
}
