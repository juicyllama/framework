import { BaseService, BeaconService, Query } from '@juicyllama/core'
import { Logger, Modules } from '@juicyllama/utils'
import { Inject, Injectable } from '@nestjs/common'
import { LazyModuleLoader } from '@nestjs/core'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'
import { ContactPhone } from './phone.entity'
import { ContactPhoneStatus, ContactPhoneType } from './phone.enums'

const E = ContactPhone
type T = ContactPhone

@Injectable()
export class ContactPhoneService extends BaseService<T> {
	constructor(
		@Inject(Query) readonly query: Query<T>,
		@InjectRepository(E) readonly repository: Repository<T>,
		private readonly logger: Logger,
		readonly beaconService: BeaconService,
		private readonly lazyModuleLoader: LazyModuleLoader,
	) {
		super(query, repository, {
			beacon: beaconService,
		})
	}

	async create(data: DeepPartial<T>): Promise<T> {
		const phone = await this.findOne({
			where: {
				contact_id: data.contact_id,
				number: data.number,
				country_iso: data.country_iso,
			},
		})

		if (phone) {
			return phone
		}

		return await super.create(data)
	}

	async validatePhoneNumber(phone: T): Promise<boolean> {
		const domain = 'crm::contacts::service::validatePhoneNumber'

		if (!phone) {
			return false
		}

		if (Modules.datacache.isInstalled) {
			const { DataCacheModule, DataCacheService, NumberVerification } = await Modules.datacache.load()

			try {
				const dataCacheModule = await this.lazyModuleLoader.load(() => DataCacheModule)
				const dataCacheService = dataCacheModule.get(DataCacheService)

				const result = await dataCacheService.get(NumberVerification, {
					number: phone.number,
					country_iso: phone.country_iso,
				})

				if (result?.valid) {
					this.logger.log(`[${domain}] ${phone.number} is a valid phone number`, result)
					await this.query.update(this.repository, {
						phone_id: phone.phone_id,
						status: ContactPhoneStatus.VERIFIED,
					})

					return result.valid
				}
			} catch (e: any) {
				this.logger.error(`[${domain}] ${e.message}`, e)
				return false
			}
		}

		if (Modules.apilayer.isInstalled) {
			const { NumberVerificationModule, NumberVerificationService } = await Modules.apilayer.load()
			const numberVerificationModule = await this.lazyModuleLoader.load(() => NumberVerificationModule)
			const numberVerificationService = numberVerificationModule.get(NumberVerificationService)

			const result = await numberVerificationService.verify(phone.number, phone.country_iso)

			if (!result) {
				this.logger.warn(`[${domain}] ${phone.number} cannot be validated`, result)
				return false
			}

			if (result.valid) {
				this.logger.log(`[${domain}] ${phone.number} is a valid phone number`, result)
				phone = await this.query.update(this.repository, {
					phone_id: phone.phone_id,
					status: ContactPhoneStatus.VERIFIED,
				})
			} else {
				this.logger.log(`[${domain}] ${phone.number} is an invalid phone number`, result)
				phone = await this.query.update(this.repository, {
					phone_id: phone.phone_id,
					status: ContactPhoneStatus.INVALID,
				})
			}

			if (Modules.datacache.isInstalled) {
				const { DataCacheModule, DataCacheService, NumberVerification } = await Modules.datacache.load()

				try {
					const dataCacheModule = await this.lazyModuleLoader.load(() => DataCacheModule)
					const dataCacheService = dataCacheModule.get(DataCacheService)
					await dataCacheService.set(NumberVerification, phone)
				} catch (e: any) {
					this.logger.error(`[${domain}] ${e.message}`, e)
				}
			}

			return result.valid
		}

		if (!Modules.apilayer.isInstalled) {
			this.logger.warn(
				`[${domain}] Skipping number verification as no service is installed, consider installing one of: ApiLayer`,
			)
			return true
		}
		return false
	}

	async cleanPhoneNumbers(phone: T): Promise<boolean> {
		const domain = 'crm::contacts::service::cleanPhoneNumbers'

		if (!phone) {
			return false
		}

		if (!Modules.apilayer.isInstalled) {
			this.logger.warn(
				`[${domain}] Skipping number verification as no service is installed, consider installing one of: ApiLayer`,
			)
			return true
		}

		const { NumberVerificationModule, NumberVerificationService } = await Modules.apilayer.load()
		const numberVerificationModule = await this.lazyModuleLoader.load(() => NumberVerificationModule)
		const numberVerificationService = numberVerificationModule.get(NumberVerificationService)

		const result = await numberVerificationService.verify(phone.number, phone.country_iso)

		if (!result) {
			this.logger.warn(`[${domain}] ${phone.number} cannot be validated`, result)
			return false
		}

		let type = ContactPhoneType.OTHER

		switch (result.line_type) {
			case 'mobile':
				type = ContactPhoneType.MOBILE
				break
			case 'landline':
				type = ContactPhoneType.LANDLINE
				break
		}

		const updated_phone = await this.query.update(this.repository, {
			phone_id: phone.phone_id,
			country_iso: result.country_code,
			number_local_format: result.international_format,
			type: type,
		})

		this.logger.log(`[${domain}] ${phone.number} has been updated`, updated_phone)
		return true
	}

	async updatePhones(phones: DeepPartial<T[]>, contact_id: number): Promise<T[]> {
		const domain = 'crm::contacts::phones::service::updatePhones'

		if (!phones || !phones.length) {
			return []
		}

		for (const p in phones) {
			let record = await this.findOne({
				where: {
					contact_id: contact_id,
					number: phones[p].number,
				},
			})

			if (!record) {
				record = await this.create({
					contact_id: contact_id,
					...phones[p],
				})
				this.logger.verbose(`[${domain}] Phone number created`, record)
			}
		}

		return await this.findAll({
			where: {
				contact_id: contact_id,
			},
		})
	}
}
