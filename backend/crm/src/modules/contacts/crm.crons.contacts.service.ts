import { SettingsService } from '@juicyllama/core'
import { CachePeriod, Env, Logger, Modules } from '@juicyllama/utils'
import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ContactPhoneStatus } from './phone/phone.enums'
import { ContactPhoneService } from './phone/phone.service'

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

		if (!Env.IsTest()) {
			let Bugsnag: any

			if (Modules.bugsnag.isInstalled) {
				Bugsnag = await Modules.bugsnag.load()
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
			} catch (e) {
				failures.push((e as Error).message)
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
