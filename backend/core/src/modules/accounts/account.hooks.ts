import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { BeaconService } from '../beacon/beacon.service'
import { Account } from './account.entity'
import { Strings } from '@juicyllama/utils'
import { User } from '../users/users.entity'
import { File } from '@juicyllama/utils'

@Injectable()
export class AccountHooks {
	constructor(@Inject(forwardRef(() => BeaconService)) private readonly beaconService: BeaconService) {}

	/**
	 * Send a new account opening notification to the account owner
	 * @param account
	 * @param owner
	 */
	async Created(account: Account, owner: User): Promise<void> {
		if (!process.env.BEACON_ACCOUNT_CREATE) {
			return
		}

		if(!owner.first_name){
			owner.first_name = 'Hi there'
		}

		const subject = `✅ Account Created`
		let markdown = ``

		if(File.exists(process.env.BEACON_ACCOUNT_CREATE+'/email.md')){
			markdown = await File.read(process.env.BEACON_ACCOUNT_CREATE+'/email.md')
			markdown = Strings.replacer(markdown, {
				account: account,
				owner: owner,
				hrefs: {
					dashboard: process.env.BASE_URL_APP + '/dashboard',
				}
			})
		}else{
			markdown = `${owner.first_name ?? 'Hello'}, we are really pleased to welcome ${
				account.account_name
			} to ${Strings.capitalize(process.env.SYSTEM_EMAIL_NAME ?? process.env.npm_package_name)}!`
		}

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

		if (!process.env.BEACON_ACCOUNT_ADMIN_TEMPORARY_PASSWORD) {
			return
		}

		if(!owner.first_name){
			owner.first_name = 'Hi there'
		}

		const subject = `🔑 Temporary Password`
		let markdown = ``

		if(File.exists(process.env.BEACON_ACCOUNT_ADMIN_TEMPORARY_PASSWORD+'/email.md')){
			markdown = await File.read(process.env.BEACON_ACCOUNT_ADMIN_TEMPORARY_PASSWORD+'/email.md')
			markdown = Strings.replacer(markdown, {
				owner: owner,
				password: password,
				hrefs: {
					reset: process.env.BASE_URL_APP + '/reset',
				}
			})
		}else{
			markdown = `${
				owner.first_name ?? 'Hello'
			}, we have automatically created you a temporary password: <strong>${password}</strong> <br /><br />Please login and change your password as soon as possible.`
		}

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
