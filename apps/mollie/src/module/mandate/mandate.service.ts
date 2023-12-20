import { BaseService, Query } from '@juicyllama/core'
import { Logger, Enviroment } from '@juicyllama/utils'
import { Mandate, MollieClient } from '@mollie/api-client'
import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'
import { InjectMollie } from '../provider'
import { MollieMandate } from './mandate.entity'
import mandateMock from './mandate.mock'

type T = MollieMandate
@Injectable()
export class MandateService extends BaseService<T> {
	constructor(
		@InjectRepository(MollieMandate) readonly repository: Repository<T>,
		private readonly logger: Logger,
		readonly query: Query<T>,
		@InjectMollie() private readonly client: MollieClient,
	) {
		super(query, repository)
	}

	async create(data: DeepPartial<T>): Promise<T> {
		const result = await this.findOne({
			where: {
				ext_mandate_id: data.ext_mandate_id,
			},
		})

		if (result) {
			return result
		}

		return await this.query.create(this.repository, data)
	}

	/**
	 * Syncs local payment details with mollie
	 */

	async syncMandate(mandate: T): Promise<T> {
		if (!mandate.customer) {
			mandate = await this.findById(mandate.mollie_mandate_id)
		}

		let mollie_response: Mandate

		try {
			if (Enviroment[process.env.NODE_ENV] === Enviroment.test) {
				this.logger.verbose(`[Test] Mock mollie mandate`)
				mollie_response = mandateMock()
			} else {
				this.logger.debug(`Get mollie mandate`, {
					mandate: mandate,
				})
				mollie_response = await this.client.customerMandates.get(mandate.ext_mandate_id, {
					customerId: mandate.customer.ext_customer_id,
				})

				this.logger.debug(`Get mollie mandate response: `, mollie_response)
			}
		} catch (e) {
			this.logger.error(`Error: ${e.message}`, {
				error: {
					message: e.message,
					request: {
						mandate: mandate,
					},
				},
			})
		}

		if (!mollie_response.id) {
			this.logger.error(`Error: Mollie mandate ID not in the response`, {
				mollie_response: mollie_response,
				mandate: mandate,
			})
		}

		return await this.update({
			mollie_mandate_id: mandate.mollie_mandate_id,
			status: mollie_response.status,
			method: mollie_response.method,
			details: mollie_response.details,
		})
	}

	async remove(): Promise<T> {
		throw new BadRequestException(`You cannot delete a customer as it is linked to an external service`)
	}
}
