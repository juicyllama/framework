import { BaseService, Query, BeaconService } from '@juicyllama/core'
import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'
import { ContactEmail } from './email.entity'
import { Logger } from '@juicyllama/utils'

const E = ContactEmail
type T = ContactEmail

@Injectable()
export class ContactEmailService extends BaseService<T> {
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

	async create(data: DeepPartial<T>): Promise<T> {

		const email = await this.findOne({ where: {
			contact_id: data.contact_id,
			email: data.email,
		}})

		if(email) {
			return email
		}

		return await super.create(data)
	}


	async updateEmails(emails: DeepPartial<T[]>, contact_id: number): Promise<T[]> {
		const domain = 'crm::contacts::email::service::updateEmails'

		if (!emails || !emails.length) {
			return null
		}

		for (const e in emails) {
			let record = await this.findOne({
				where: {
					contact_id: contact_id,
					email: emails[e].email,
				},
			})

			if (!record) {
				record = await this.create({
					contact_id: contact_id,
					...emails[e],
				})
				this.logger.verbose(`[${domain}] Email created`, record)
			}
		}

		return await this.findAll({
			where: {
				contact_id: contact_id,
			},
		})
	}
}
