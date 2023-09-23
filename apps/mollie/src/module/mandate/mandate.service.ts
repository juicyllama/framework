import { forwardRef, Inject, Injectable, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'
import { MollieMandate } from './mandate.entity'
import { Logger, Enviroment } from '@juicyllama/utils'
import { createMollieClient, Mandate } from '@mollie/api-client'
import mandateMock from './mandate.mock'
import { ConfigService } from '@nestjs/config'
import { BaseService, Query } from '@juicyllama/core'
import { CustomerService } from '../customer/customer.service'

const E = MollieMandate
type T = MollieMandate
@Injectable()
export class MandateService extends BaseService<T> {
	constructor(
		@InjectRepository(E) readonly repository: Repository<T>,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => Query)) readonly query: Query<T>,
		@Inject(forwardRef(() => CustomerService)) private readonly customerService: CustomerService,
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
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
				const mollieClient = createMollieClient({
					apiKey: this.configService.get<string>('mollie.MOLLIE_API_KEY'),
				})
				mollie_response = await mollieClient.customerMandates.get(mandate.ext_mandate_id, {
					customerId: mandate.customer.ext_customer_id,
				})

				this.logger.debug(`Get mollie mandate response: `, mollie_response)
			}
		} catch (e: any) {
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
