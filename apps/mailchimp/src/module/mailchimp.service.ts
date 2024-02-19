import { InjectConfig, Query } from '@juicyllama/core'
import { Env, Logger } from '@juicyllama/utils'
import * as Client from '@mailchimp/mailchimp_marketing'
import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { MailchimpConfigDto } from '../configs/mailchimp.config.dto'
import { InjectMailchimp } from './mailchimp.constants'
import { MailchimpContact } from './mailchimp.entity'
import { mapperContactToMember } from './mappers/mailchimp.list.member.mapper'

@Injectable()
export class MailchimpService {
	constructor(
		private readonly logger: Logger,
		@InjectRepository(MailchimpContact) private readonly repository: Repository<MailchimpContact>,
		@Inject(forwardRef(() => Query)) private readonly query: Query<MailchimpContact>,
		@InjectConfig(MailchimpConfigDto) private readonly config: MailchimpConfigDto,
		@InjectMailchimp() private readonly client: typeof Client,
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

		if (!this.config.MAILCHIMP_API_KEY || !this.config.MAILCHIMP_SERVER_PREFIX) {
			throw new Error('Mailchimp API Key or Server Prefix not set')
		}

		try {
			const member = mapperContactToMember(contact)

			const mailchimp_member = await this.query.findOneByWhere(this.repository, {
				contact_id: contact.contact_id,
			})

			let response

			if (mailchimp_member) {
				response = await this.client.lists.updateListMember(
					this.config.MAILCHIMP_LIST_ID,
					mailchimp_member.mailchimp_id,
					member,
				)
				this.logger.debug(`[${domain}] Mailchimp contact updated #${mailchimp_member.mailchimp_id}`, response)
				return true
			} else {
				response = await this.client.lists.addListMember(this.config.MAILCHIMP_LIST_ID, member)

				if (response && 'id' in response) {
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

		if (!this.config.MAILCHIMP_API_KEY || !this.config.MAILCHIMP_SERVER_PREFIX) {
			throw new Error('Mailchimp API Key or Server Prefix not set')
		}

		try {
			const mailchimp_member = await this.query.findOneByWhere(this.repository, {
				contact_id: contact.contact_id,
			})

			let response

			if (mailchimp_member) {
				response = await this.client.lists.deleteListMember(
					this.config.MAILCHIMP_LIST_ID,
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
