import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { CachePeriod, Enviroment, Logger, Modules } from '@juicyllama/utils'
import { ConfigService } from '@nestjs/config'
import { SettingsService } from '@juicyllama/core'
import { ContactPhoneService } from '../contacts/phone/phone.service'
import { ContactPhoneStatus } from '../contacts/phone/phone.enums'

@Injectable()
export class CrmCronsContactsService {
	constructor(
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => SettingsService)) private readonly settingsService: SettingsService,
		@Inject(forwardRef(() => ContactPhoneService)) private readonly contactPhoneService: ContactPhoneService,
	) {}

	async validatePhoneNumbers() {
		const domain = 'cron::crm::validatePhoneNumbers'

		if (![Enviroment.test].includes(this.configService.get('NODE_ENV'))) {
			let Bugsnag: any

			if (Modules.isInstalled('@bugsnag/js')) {
				Bugsnag = require('@bugsnag/js')
				Bugsnag.addMetadata('cron', {
					domain: domain,
				})
			}
		}

		if (!(await this.settingsService.cronCheck(domain, CachePeriod.HOUR))) {
			return
		}

		let success = 0
		let failed = 0
		const failures = []

		const phones = await this.contactPhoneService.findAll({
			where: {
				status: ContactPhoneStatus.UNVERIFIED,
			},
		})

		this.logger.log(`[${domain}] ${phones.length} Unverified Phone Numbers Found`)

		for (const phone of phones) {
			try {
				const result = await this.contactPhoneService.validatePhoneNumber(phone)

				if (result) {
					success++
					await this.contactPhoneService.cleanPhoneNumbers(phone)
				} else {
					failed++
				}
			} catch (e: any) {
				failures.push(e.message)
			}
		}

		// Wrap-up and return results
		await this.settingsService.cronEnd(domain)

		return {
			phones: {
				total: phones.length,
				success: success,
				failed: failed,
				failures: failures,
			},
		}
	}
}
