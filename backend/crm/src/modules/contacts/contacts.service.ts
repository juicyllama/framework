import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Logger, Modules } from '@juicyllama/utils'
import {
	BeaconService,
	Query,
	StorageService,
	UserAvatarType,
	StorageFileFormat,
	StorageType,
	BaseService,
} from '@juicyllama/core'
import { Contact } from './contacts.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'
import { LazyModuleLoader } from '@nestjs/core'
import { ContactSocialService } from './social/social.service'
import { ContactPhoneService } from './phone/phone.service'
import { ContactEmailService } from './email/email.service'
import { ContactAddressService } from './address/address.service'
import { isNil, omitBy } from 'lodash'

const E = Contact
type T = Contact

@Injectable()
export class ContactsService extends BaseService<T> {
	constructor(
		@InjectRepository(E) readonly repository: Repository<T>,
		@Inject(forwardRef(() => Query)) readonly query: Query<T>,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => BeaconService)) readonly beaconService: BeaconService,
		@Inject(forwardRef(() => StorageService)) private readonly storageService: StorageService,
		@Inject(forwardRef(() => LazyModuleLoader)) private readonly lazyModuleLoader: LazyModuleLoader,
		@Inject(forwardRef(() => ContactSocialService)) private readonly contactSocialService: ContactSocialService,
		@Inject(forwardRef(() => ContactPhoneService)) private readonly contactPhoneService: ContactPhoneService,
		@Inject(forwardRef(() => ContactEmailService)) private readonly contactEmailService: ContactEmailService,
		@Inject(forwardRef(() => ContactAddressService)) private readonly contactAddressService: ContactAddressService,
	) {
		super(query, repository, {
			beacon: beaconService,
		})
	}

	async create(data: DeepPartial<T>): Promise<T> {
		const domain = 'crm::contacts::service::create'

		const contact = await super.create(data)

		this.logger.verbose(`[${domain}] Contact created`, contact)
		await this.patchMailchimp(contact)
		return contact
	}

	async findByEmail(email: string): Promise<T> {
		return await super.findOne({
			where: {
				emails: {
					email: email,
				},
			},
		})
	}

	async update(data: DeepPartial<T>): Promise<T> {
		const domain = 'crm::contacts::service::update'

		if (!data.contact_id) throw new Error('Contact ID is required')

		if (data.phones) data.phones = await this.contactPhoneService.updatePhones(data.phones, data.contact_id)
		if (data.emails) data.emails = await this.contactEmailService.updateEmails(data.emails, data.contact_id)
		if (data.socials) data.socials = await this.contactSocialService.updateSocials(data.socials, data.contact_id)
		if (data.addresses)
			data.addresses = await this.contactAddressService.updateAddresses(data.addresses, data.contact_id)

		data = omitBy(data, isNil)

		this.logger.verbose(`[${domain}] Updating contact`, data)
		const contact = await super.update(data)
		await this.patchMailchimp(contact)
		return contact
	}

	async remove(contact: T): Promise<T> {
		await this.deleteMailchimp(contact)
		return await super.remove(contact)
	}

	async purge(contact: T): Promise<void> {
		await this.deleteMailchimp(contact)
		await super.purge(contact)
	}

	/**
	 * Updates the avatar
	 *
	 * * Upload to S3
	 * * Update user avatar_type and avatar_image_url
	 */

	async uploadAvatar(contact: T, file: Express.Multer.File): Promise<T> {
		const result = await this.storageService.write({
			location: `account/${contact.account_id}/contacts/${contact.contact_id}/avatars/${file.originalname}`,
			permissions: StorageType.PUBLIC,
			format: StorageFileFormat.Express_Multer_File,
			file: file,
		})

		if (result?.url) {
			contact = await this.query.update(this.repository, {
				contact_id: contact.contact_id,
				avatar_type: UserAvatarType.IMAGE,
				avatar_image_url: result.url,
			})
		}
		return contact
	}

	async patchMailchimp(contact: T): Promise<void> {
		const domain = 'crm::contacts::service::patchMailchimp'

		if (Modules.mailchimp.isInstalled && contact.emails?.length) {
			this.logger.verbose(`[${domain}] Mailchimp is installed`)

			const { MailchimpModule, MailchimpService } = await Modules.mailchimp.load()

			try {
				const mailchimpModule = await this.lazyModuleLoader.load(() => MailchimpModule)
				const mailchimpService = mailchimpModule.get(MailchimpService)
				await mailchimpService.patchContact(contact)
			} catch (e: any) {
				this.logger.error(`[${domain}] ${e.message}`, e)
			}
		}
	}

	async deleteMailchimp(contact: T): Promise<void> {
		const domain = 'crm::contacts::service::deleteMailchimp'

		if (Modules.mailchimp.isInstalled && contact.emails?.length) {
			this.logger.verbose(`[${domain}] Mailchimp is installed`)

			const { MailchimpModule, MailchimpService } = await Modules.aws.load()

			try {
				const mailchimpModule = await this.lazyModuleLoader.load(() => MailchimpModule)
				const mailchimpService = mailchimpModule.get(MailchimpService)
				await mailchimpService.deleteContact(contact)
			} catch (e: any) {
				this.logger.error(`[${domain}] ${e.message}`, e)
			}
		}
	}
}
