import { SNSClient, PublishCommand, PublishCommandInput } from '@aws-sdk/client-sns'
import { Injectable } from '@nestjs/common'
import type { BeaconMessageDto } from '@juicyllama/core'
import { Env, Logger } from '@juicyllama/utils'
import { InjectSns } from './aws.sns.constants'

@Injectable()
export class AwsSnsService {
	constructor(
		private readonly logger: Logger,
		@InjectSns() private readonly snsClient: SNSClient,
	) {}

	/**
	 * Send a sms using SNS
	 *
	 * @param {BeaconMessageDto} message
	 */

	async send(message: BeaconMessageDto): Promise<boolean> {
		const domain = 'app::aws::sns::AwsSnsService::send'

		this.logger.debug(`[${domain}] Send sms`, message)

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return true
		}

		try {
			const params = await this.mapSms(message)

			const command = new PublishCommand(params)

			const data = await this.snsClient.send(command)

			this.logger.debug(`[${domain}] Result`, data)

			return data.$metadata.httpStatusCode === 200
		} catch (e) {
			this.logger.warn(
				`[${domain}] Error: ${e.message}`,
				e.response
					? {
							status: e.response.status,
							data: e.response.data,
						}
					: null,
			)
			return false
		}
	}

	async mapSms(message: BeaconMessageDto): Promise<PublishCommandInput> {
		return <PublishCommandInput>{
			Message: message.markdown,
			PhoneNumber: message.communication.phone,
		}
	}
}
