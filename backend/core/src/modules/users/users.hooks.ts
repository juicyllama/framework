import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Strings } from '@juicyllama/utils'
import { ConfigService } from '@nestjs/config'
import { BeaconService } from '../beacon/beacon.service.js'

@Injectable()
export class UsersHooks {
	constructor(
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
		@Inject(forwardRef(() => BeaconService)) private readonly beaconService: BeaconService,
	) {}

	async invited(account, user) {
		const subject = `🎉 You are invited to join ${account.account_name} on ${Strings.capitalize(
			this.configService.get(`PROJECT_NAME`),
		)}`
		const markdown = `${user.first_name}, you have been invited to join ${
			account.account_name
		}'s account on ${Strings.capitalize(this.configService.get(`PROJECT_NAME`))}!
		
You can [set your password here](${this.configService.get(`APP_BASE_URL`)}/reset).`
		await this.beaconService.notify({
			methods: {
				email: true,
			},
			communication: {
				email: {
					to: {
						email: user.email,
						name: user.name,
					},
				},
			},
			subject: subject,
			markdown: markdown,
			json: {},
		})
	}
	async account_added(account, user) {
		const subject = `🎉 You've joined ${account.account_name} on ${Strings.capitalize(
			this.configService.get(`PROJECT_NAME`),
		)}`
		const markdown = `${user.first_name}, ${
			account.account_name
		} has added you to their account on ${Strings.capitalize(this.configService.get(`PROJECT_NAME`))}!
		
You can [login here](${this.configService.get(`APP_BASE_URL`)}/login) with your existing credentials.`
		await this.beaconService.notify({
			methods: {
				email: true,
			},
			communication: {
				email: {
					to: {
						email: user.email,
						name: user.name,
					},
				},
			},
			subject: subject,
			markdown: markdown,
			json: {},
		})
	}
}
