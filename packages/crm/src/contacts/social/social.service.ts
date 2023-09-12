import { BaseService, Query, BeaconService } from '@juicyllama/core'
import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'
import { ContactSocial } from './social.entity'
import { Logger } from '@juicyllama/utils'

const E = ContactSocial
type T = ContactSocial

@Injectable()
export class ContactSocialService extends BaseService<T> {
	constructor(
		@Inject(forwardRef(() => Query)) readonly query: Query<T>,
		@InjectRepository(E) readonly repository: Repository<T>,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => BeaconService)) readonly beaconService: BeaconService,
	) {
		super(query, repository, {
			beacon: beaconService,
		})
	}

	async updateSocials(socials: DeepPartial<T[]>, contact_id: number): Promise<T[]> {
		const domain = 'crm::contacts::socials::service::updateSocials'

		if (!socials || !socials.length) {
			return null
		}

		for (const s in socials) {
			let record = await this.findOne({
				where: {
					contact: {
						contact_id: contact_id,
					},
					type: socials[s].type,
					handle: socials[s].handle,
				},
			})

			if (!record) {
				record = await this.create({
					contact: {
						contact_id: contact_id,
					},
					...socials[s],
				})
				this.logger.verbose(`[${domain}] Social created`, record)
			}
		}

		return await this.findAll({
			where: {
				contact: {
					contact_id: contact_id,
				},
			},
		})
	}
}
