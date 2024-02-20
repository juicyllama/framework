import { Api, Env, Logger } from '@juicyllama/utils'
import { Injectable } from '@nestjs/common'
import { getEverflowAxiosConfig } from '../../../../config/everflow.config'
import { EverflowConfigDto } from '../../../../config/everflow.config.dto'
import * as mock from '../../../../types/click/clicks.mock.json'
import { EverflowClick } from '../../../../types/click/everflow.click.dto'
import { EverflowAffiliateReportingClicksBody } from './everflow.affiliate.reporting.clicks.dto'

const ENDPOINT = `https://api.eflow.team/v1/affiliates/reporting/clicks/stream`

@Injectable()
export class EverflowAffiliateReportingClicksService {
	constructor(
		private readonly api: Api,
		private readonly logger: Logger,
	) {}

	async findAll(options: {
		arguments: EverflowAffiliateReportingClicksBody
		config: EverflowConfigDto
	}): Promise<EverflowClick[]> {
		const domain = 'app::everflow::affiliate::reporting::clicks::findAll'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return mock.clicks
		}

		if (!options.arguments.timezone_id) {
			options.arguments.timezone_id = 67 //UTC
		}

		try {
			return await this.api.post(domain, ENDPOINT, options.arguments, getEverflowAxiosConfig(options.config))
		} catch (err) {
			const e = err as Error
			this.logger.error(`[${domain}] Error finding clicks: ${e.message}`, e)
			throw e
		}
	}
}
