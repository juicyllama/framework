import { Account, BaseService, Query } from '@juicyllama/core'
import { Env, Logger } from '@juicyllama/utils'
import { Customer, MollieClient } from '@mollie/api-client'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { InjectMollie } from '../provider'
import { MollieCustomer } from './customer.entity'
import customerMock from './customer.mock'

type T = MollieCustomer
@Injectable()
export class CustomerService extends BaseService<T> {
	constructor(
		@InjectRepository(MollieCustomer) readonly repository: Repository<T>,
		private readonly logger: Logger,
		readonly query: Query<T>,
		@InjectMollie() private readonly client: MollieClient,
	) {
		super(query, repository)
	}

	async create(account: Account): Promise<T> {
		const result = await this.findByAccount(account)

		if (result) {
			return result
		}

		let mollie_response: Customer

		try {
			if (Env.IsTest()) {
				this.logger.verbose(`[Test] Mock mollie customer`)
				mollie_response = customerMock()
			} else {
				this.logger.debug(`Create mollie customer`, account)
				mollie_response = await this.client.customers.create({
					name: `${account.company_name} (${account.account_id})`,
					metadata: <any>{
						account_id: account.account_id,
					},
				})
				this.logger.debug(`Create mollie customer response: `, mollie_response)
			}

			if (!mollie_response.id) {
				this.logger.error(`Error: Mollie customer ID not in the response`, {
					mollie_response: mollie_response,
					account: account,
				})
				new Error(`Mollie customer ID not in the response`)
			}

			return await this.query.create(this.repository, {
				ext_customer_id: mollie_response.id,
				account: account,
			})
		} catch (e) {
			this.logger.error(`Error: ${e.message}`, {
				error: {
					message: e.message,
					request: {
						account: account,
					},
				},
			})
		}
	}

	async findByAccount(account: Account): Promise<MollieCustomer> {
		return await this.query.findOne(this.repository, {
			where: {
				account_id: account.account_id,
			},
		})
	}

	async remove(): Promise<T> {
		throw new BadRequestException(`You cannot delete a customer as it is linked to an external service`)
	}
}
