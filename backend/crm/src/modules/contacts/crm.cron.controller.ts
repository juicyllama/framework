import { CronGuard, CronRunner } from '@juicyllama/core'
import { Controller, forwardRef, Inject, Post, UseGuards } from '@nestjs/common'
import { ApiExcludeController } from '@nestjs/swagger'
import { CrmCronsContactsService } from './crm.crons.contacts.service'

@UseGuards(CronGuard)
@ApiExcludeController()
@Controller('crons/crm')
export class CRMCronsController {
	constructor(
		@Inject(forwardRef(() => CrmCronsContactsService))
		private readonly crmCronsContactsService: CrmCronsContactsService,
	) {}

	/**
	 * Validates any phone numbers that are not validated
	 */

	@Post('contacts/validatePhoneNumbers')
	async validatePhoneNumbers() {
		const domain = 'cron::crm::validatePhoneNumbers'
		return await CronRunner(domain, this.crmCronsContactsService.validatePhoneNumbers())
	}
}
