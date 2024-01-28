import { BaseService, BeaconService, Query } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'
import { ContactAddress } from './address.entity'

const E = ContactAddress
type T = ContactAddress

@Injectable()
export class ContactAddressService extends BaseService<T> {
	constructor(
		@Inject(Query) readonly query: Query<T>,
		@InjectRepository(E) readonly repository: Repository<T>,
		private readonly logger: Logger,
		readonly beaconService: BeaconService,
	) {
		super(query, repository, {
			beacon: beaconService,
		})
	}

	async create(data: DeepPartial<T>): Promise<T> {
		const address = await this.findOne({
			where: {
				contact_id: data.contact_id,
				address_1: data.address_1,
				post_code: data.post_code,
				country_iso: data.country_iso,
			},
		})

		if (address) {
			return address
		}

		return await super.create(data)
	}

	async updateAddresses(addresses: DeepPartial<T[]>, contact_id: number): Promise<T[]> {
		const domain = 'crm::contacts::addresses::service::updateAddresses'

		if (!addresses || !addresses.length) {
			return []
		}

		for (const a in addresses) {
			let record = await this.findOne({
				where: {
					contact_id: contact_id,
					address_1: addresses[a].address_1,
					address_2: addresses[a].address_2,
					city: addresses[a].city,
					post_code: addresses[a].post_code,
					state: addresses[a].state,
					country_iso: addresses[a].country_iso,
				},
			})

			if (!record) {
				record = await this.create({
					contact_id: contact_id,
					...addresses[a],
				})
				this.logger.verbose(`[${domain}] Social created`, record)
			}
		}

		return await this.findAll({
			where: {
				contact_id: contact_id,
			},
		})
	}
}
