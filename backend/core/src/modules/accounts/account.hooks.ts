import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { BeaconService } from '../beacon/beacon.service'
import { Account } from './account.entity'
import { Strings } from '@juicyllama/utils'
import { User } from '../users/users.entity'

@Injectable()
export class AccountHooks {
	constructor(@Inject(forwardRef(() => BeaconService)) private readonly beaconService: BeaconService) {}

	/**
	 * Send a new account opening notification to the account owner if !BEACON_DISABLE_ACCOUNT_CREATION
	 * @param account
	 * @param owner
	 */
	async Created(account: Account, owner: User): Promise<void> {
		if (process.env.BEACON_DISABLE_ACCOUNT_CREATION) {
			return
		}

		const subject = `✅  ${account.account_name} Account Created`
		const markdown = `${owner.first_name ?? 'Hello'}, we are really pleased to welcome ${
			account.account_name
		} to ${Strings.capitalize(process.env.SYSTEM_EMAIL_NAME ?? process.env.npm_package_name)}!`
		await this.beaconService.notify({
			methods: {
				email: true,
			},
			communication: {
				email: {
					to: {
						email: owner.email,
						name: owner.first_name ?? 'Account Owner',
					},
				},
			},
			subject: subject,
			markdown: markdown,
			json: {},
		})
	}

	async TempPassowrd(owner: User, password: string): Promise<void> {
		const subject = `🔑 Temporary Password`
		const markdown = `${
			owner.first_name ?? 'Hello'
		}, we have automatically created you a temporary password: <strong>${password}</strong> <br /><br />Please login and change your password as soon as possible.`
		await this.beaconService.notify({
			methods: {
				email: true,
			},
			communication: {
				email: {
					to: {
						email: owner.email,
						name: owner.first_name ?? 'Account Owner',
					},
				},
			},
			subject: subject,
			markdown: markdown,
			json: {},
		})
	}
}
