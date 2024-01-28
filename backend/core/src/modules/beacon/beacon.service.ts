import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { BeaconMessageDto } from './beacon.dto'
import { BeaconEmailService } from './email/email.service'
import { BeaconImService } from './im/im.service'
import { BeaconNotificationService } from './notification/notification.service'
import { BeaconPushService } from './push/push.service'
import { BeaconSmsService } from './sms/sms.service'

@Injectable()
export class BeaconService {
	constructor(
		private readonly beaconEmailService: BeaconEmailService,
		private readonly beaconPushService: BeaconPushService,
		private readonly beaconSmsService: BeaconSmsService,
		private readonly beaconImService: BeaconImService,
		@Inject(forwardRef(() => BeaconNotificationService))
		private readonly beaconNotificationService: BeaconNotificationService,
	) {}

	/**
	 * Send a beacon out
	 */

	async notify(message: BeaconMessageDto): Promise<boolean> {
		let result: boolean | undefined = false

		if (message.methods.email) {
			result = await this.beaconEmailService.create(message)
		}

		if (message.methods.sms) {
			result = await this.beaconSmsService.create(message)
		}

		if (message.methods.im) {
			result = await this.beaconImService.create(message)
		}

		if (message.methods.webhook) {
		}

		if (message.methods.push) {
			result = await this.beaconPushService.create(message)
		}

		if (message.methods.notification) {
			result = !!(await this.beaconNotificationService.create(message))
		}

		return result || false
	}

	async sendPush(event: string, json: any): Promise<void> {
		await this.notify({
			methods: {
				push: true,
			},
			communication: {
				event: event,
			},
			json: json,
		})
	}
}
