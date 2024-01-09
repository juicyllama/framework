import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { MollieCustomer } from './customer.entity'
import { Enviroment, Logger } from '@juicyllama/utils'
import { createMollieClient, Customer } from '@mollie/api-client'
import { ConfigService } from '@nestjs/config'
import customerMock from './customer.mock'
import { Account, BaseService, Query } from '@juicyllama/core'

const E = MollieCustomer
type T = MollieCustomer
@Injectable()
export class CustomerService extends BaseService<T> {
	constructor(
		@InjectRepository(E) readonly repository: Repository<T>,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => Query)) readonly query: Query<T>,
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
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
			if (Enviroment[process.env.NODE_ENV] === Enviroment.test) {
				this.logger.verbose(`[Test] Mock mollie customer`)
				mollie_response = customerMock()
			} else {
				this.logger.debug(`Create mollie customer`, account)
				const mollieClient = createMollieClient({
					apiKey: this.configService.get<string>('mollie.MOLLIE_API_KEY'),
				})
				mollie_response = await mollieClient.customers.create({
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
