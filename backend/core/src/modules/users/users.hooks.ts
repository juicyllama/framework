import { Strings, File } from '@juicyllama/utils'
import { Injectable, Inject, forwardRef } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BeaconService } from '../beacon/beacon.service'
import { Account } from '../accounts/account.entity'
import { User } from '../users/users.entity'

@Injectable()
export class UsersHooks {
	constructor(
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
		@Inject(forwardRef(() => BeaconService)) readonly beaconService: BeaconService,
	) {}

	async invited(account: Account, user: User) {
		if (!process.env.BEACON_USER_INVITED) {
			return
		}

		const subject = `🎉 You are invited to join ${account.account_name} on ${Strings.capitalize(
			this.configService.get(`PROJECT_NAME`, 'PROJECT_NAME'),
		)}`

		let markdown = ``

		if (File.exists(process.env.BEACON_USER_INVITED + '/email.md')) {
			markdown = await File.read(process.env.BEACON_ACCOUNT_CREATE + '/email.md')
			markdown = Strings.replacer(markdown, {
				account: account,
				user: user,
				hrefs: {
					reset: process.env.BASE_URL_APP + '/reset?email=' + user.email,
				},
				env: process.env,
			})
		} else {
			markdown = `${user.first_name}, you have been invited to join ${
				account.account_name
			}'s account on ${Strings.capitalize(this.configService.get(`PROJECT_NAME`, 'PROJECT_NAME'))}!

	You can [set your password here](${this.configService.get(`APP_BASE_URL`)}/reset).`
		}

		await this.beaconService.notify({
			methods: {
				email: true,
			},
			communication: {
				email: {
					to: {
						email: user.email,
						name: `${user.first_name} ${user.last_name}`,
					},
				},
			},
			subject: subject,
			markdown: markdown,
			json: {},
		})
	}

	async account_added(account: Account, user: User) {
		if (!process.env.BEACON_USER_ADDED) {
			return
		}

		const subject = `🎉 You've joined ${account.account_name} on ${Strings.capitalize(
			this.configService.get(`PROJECT_NAME`, 'PROJECT_NAME'),
		)}`

		let markdown = ``

		if (File.exists(process.env.BEACON_USER_ADDED + '/email.md')) {
			markdown = await File.read(process.env.BEACON_USER_ADDED + '/email.md')
			markdown = Strings.replacer(markdown, {
				account: account,
				user: user,
				hrefs: {
					login: process.env.BASE_URL_APP + '/login',
				},
				env: process.env,
			})
		} else {
			markdown = `${user.first_name}, ${
				account.account_name
			} has added you to their account on ${Strings.capitalize(
				this.configService.get(`PROJECT_NAME`, 'PROJECT_NAME'),
			)}!

	You can [login here](${this.configService.get(`APP_BASE_URL`)}/login) with your existing credentials.`
		}

		await this.beaconService.notify({
			methods: {
				email: true,
			},
			communication: {
				email: {
					to: {
						email: user.email,
						name: `${user.first_name} ${user.last_name}`,
					},
				},
			},
			subject: subject,
			markdown: markdown,
			json: {},
		})
	}
}
