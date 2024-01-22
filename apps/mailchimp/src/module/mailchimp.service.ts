import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { Api, Env, Logger } from '@juicyllama/utils'
import { ConfigService } from '@nestjs/config'
import { MailchimpScaffold } from '../configs/mailchimp.scaffold'
import { Query } from '@juicyllama/core'
import { MailchimpContact } from './mailchimp.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { mapperContactToMember } from './mappers/mailchimp.list.member.mapper'

@Injectable()
export class MailchimpService {
	constructor(
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => Api)) private readonly api: Api,
		@InjectRepository(MailchimpContact) private readonly repository: Repository<MailchimpContact>,
		@Inject(forwardRef(() => Query)) private readonly query: Query<MailchimpContact>,
	) {}

	/**
	 * Creates or updates a list member
	 * @param contact
	 */
	async patchContact(contact: any): Promise<boolean> {
		const domain = 'app-mailchimp::patchContact'

		if (Env.IsTest()) {
			this.logger.verbose(`[${domain}] Skipping as testing`)
			return true
		}

		if (!this.configService.get<string>('mailchimp.MAILCHIMP_API_KEY') || !this.configService.get<string>('mailchimp.MAILCHIMP_SERVER_PREFIX')) {
			throw new Error('Mailchimp API Key or Server Prefix not set')
		}

		try {
			const mailchimp = MailchimpScaffold(
				this.configService.get<string>('mailchimp.MAILCHIMP_API_KEY') as string,
				this.configService.get<string>('mailchimp.MAILCHIMP_SERVER_PREFIX') as string,
			)

			const member = mapperContactToMember(contact)

			const mailchimp_member = await this.query.findOneByWhere(this.repository, {
				contact_id: contact.contact_id,
			})

			let response

			if (mailchimp_member) {
				response = await mailchimp.lists.updateListMember(
					this.configService.get<string>('mailchimp.MAILCHIMP_LIST_ID'),
					mailchimp_member.mailchimp_id,
					member,
				)
				this.logger.debug(`[${domain}] Mailchimp contact updated #${mailchimp_member.mailchimp_id}`, response)
				return true
			} else {
				response = await mailchimp.lists.addListMember(
					this.configService.get<string>('mailchimp.MAILCHIMP_LIST_ID'),
					member,
				)

				if (response?.id) {
					await this.query.create(this.repository, {
						mailchimp_id: response.id,
						contact_id: contact.contact_id,
					})

					this.logger.debug(`[${domain}] Mailchimp contact created #${response.id}`, response)
					return true
				} else {
					this.logger.error(`[${domain}] Error creating Mailchimp contact`, response)
					return false
				}
			}
		} catch (e: any) {
			this.logger.error(`[${domain}] ${e.message}`, e)
			return false
		}
	}

	/**
	 * Deletes a contact
	 * @param contact
	 */

	async deleteContact(contact: any): Promise<boolean> {
		const domain = 'app-mailchimp::deleteContact'

		if (Env.IsTest()) {
			this.logger.verbose(`[${domain}] Skipping as testing`)
			return true
		}


		if (!this.configService.get<string>('mailchimp.MAILCHIMP_API_KEY') || !this.configService.get<string>('mailchimp.MAILCHIMP_SERVER_PREFIX')) {
			throw new Error('Mailchimp API Key or Server Prefix not set')
		}

		try {
			const mailchimp = MailchimpScaffold(
				this.configService.get<string>('mailchimp.MAILCHIMP_API_KEY') as string,
				this.configService.get<string>('mailchimp.MAILCHIMP_SERVER_PREFIX') as string,
			)

			const mailchimp_member = await this.query.findOneByWhere(this.repository, {
				contact_id: contact.contact_id,
			})

			let response

			if (mailchimp_member) {
				response = await mailchimp.lists.deleteListMember(
					this.configService.get<string>('mailchimp.MAILCHIMP_LIST_ID'),
					mailchimp_member.mailchimp_id,
				)
				await this.query.purge(this.repository, mailchimp_member)
				this.logger.debug(`[${domain}] Mailchimp contact #${mailchimp_member.mailchimp_id} deleted`, response)
			}

			return true
		} catch (e: any) {
			this.logger.error(`[${domain}] ${e.message}`, e)
			return false
		}
	}
}
