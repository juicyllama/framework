import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { BeaconService } from '../beacon/beacon.service.js'
import { Account } from './account.entity.js'
import { Strings } from '@juicyllama/utils'
import { User } from '../users/users.entity.js'

@Injectable()
export class AccountHooks {
	constructor(@Inject(forwardRef(() => BeaconService)) private readonly beaconService: BeaconService) {}

	async Created(account: Account, owner: User): Promise<void> {
		const subject = `✅  ${account.account_name} Account Created`
		const markdown = `${owner.first_name}, we are really pleased to welcome ${
			account.account_name
		} to ${Strings.capitalize(process.env.npm_package_name)}!`
		await this.beaconService.notify({
			methods: {
				email: true,
			},
			communication: {
				email: {
					to: {
						email: owner.email,
						name: owner.first_name,
					},
				},
			},
			subject: subject,
			markdown: markdown,
			json: {},
		})
	}
}
