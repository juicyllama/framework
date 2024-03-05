import { BaseService, Query, BeaconService } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'
import { ContactSocial } from './social.entity'

const E = ContactSocial
type T = ContactSocial

@Injectable()
export class ContactSocialService extends BaseService<T> {
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
		const social = await this.findOne({
			where: {
				contact_id: data.contact_id,
				type: data.type,
				handle: data.handle,
			},
		})

		if (social) {
			return social
		}

		return await super.create(data)
	}

	async updateSocials(socials: DeepPartial<T[]>, contact_id: number): Promise<T[]> {
		const domain = 'crm::contacts::socials::service::updateSocials'

		if (!socials || !socials.length) {
			return []
		}

		for (const s in socials) {
			let record = await this.findOne({
				where: {
					contact_id: contact_id,
					type: socials[s].type,
					handle: socials[s].handle,
				},
			})

			if (!record) {
				record = await this.create({
					contact_id: contact_id,
					...socials[s],
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
