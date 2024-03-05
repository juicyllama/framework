import { Injectable, Inject, forwardRef } from '@nestjs/common'
import { Api, Logger } from '@juicyllama/utils'
import { ConfigService } from '@nestjs/config'
import { ENDPOINT } from '../../utils/constants'
import { parseTextData } from '../../utils/textToObj'
import querystring from 'querystring'
import {
	CompetitorsInOrganicSearchParams,
	DomainOrganicSearchKeywordsParams,
	DomainVsDomainParams,
} from '../../utils/intefaces'

@Injectable()
export class DomainReportService {
	private key: string | undefined

	constructor(
		@Inject(forwardRef(() => Api)) private readonly api: Api,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
	) {
		this.key = this.configService.get<string>('semrush.SEMRUSH_API_KEY')
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
