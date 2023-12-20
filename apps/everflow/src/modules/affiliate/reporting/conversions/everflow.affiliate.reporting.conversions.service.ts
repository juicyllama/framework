import { Api, Logger, Env } from '@juicyllama/utils'
import { Injectable } from '@nestjs/common'
import * as mock from '../../../../types/conversion/conversions.mock.json'
import { EverflowConfigDto } from '../../../../config/everflow.config.dto'
import { getEverflowAxiosConfig } from '../../../../config/everflow.config'
import { EverflowConversion } from '../../../../types/conversion/conversion.dto'
import { EverflowAffiliateReportingConversionBody } from './everflow.affiliate.reporting.conversion.dto'

const ENDPOINT = 'https://api.eflow.team/v1/affiliates/reporting/conversions'

@Injectable()
export class EverflowAffiliateReportingConversionsService {
	constructor(
		private readonly api: Api,
		private readonly logger: Logger,
	) {}

	async findAll(options: {
		arguments: EverflowAffiliateReportingConversionBody
		config?: EverflowConfigDto
	}): Promise<EverflowConversion[]> {
		const domain = 'app::everflow::affiliate::reporting::conversions::findAll'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return mock.conversions
		}

		if (!options.arguments.timezone_id) {
			options.arguments.timezone_id = 67 //UTC
		}

		try {
			return await this.api.post(
				domain,
				ENDPOINT,
				{
					...options.arguments,
					show_conversions: true,
					show_events: true,
				},
				getEverflowAxiosConfig(options.config),
			)
		} catch (e) {
			this.logger.error(`[${domain}] Error finding conversions: ${e.message}`, e)
		}
	}
}
