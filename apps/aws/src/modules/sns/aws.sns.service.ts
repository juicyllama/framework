import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Logger } from '@juicyllama/utils'
import { SNSClient, PublishCommand, PublishCommandInput } from '@aws-sdk/client-sns'
import { ConfigService } from '@nestjs/config'
import type { BeaconMessageDto } from '@juicyllama/core'
import { Env } from '@juicyllama/utils'

@Injectable()
export class AwsSnsService {
	constructor(
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
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

		const region =
			this.configService.get<string>('awsSns.AWS_SES_JL_REGION') ??
			this.configService.get<string>('aws.AWS_JL_REGION')
		if (!region) {
			throw new Error('AWS Region not set')
		}

		const accessKeyId = this.configService.get<string>('aws.AWS_JL_ACCESS_KEY_ID')
		const secretAccessKey = this.configService.get<string>('aws.AWS_JL_SECRET_KEY_ID')
		if (!accessKeyId || !secretAccessKey) {
			throw new Error('AWS Credentials not set')
		}

		try {
			const client = new SNSClient({
				region,
				credentials: {
					accessKeyId,
					secretAccessKey,
				},
			})

			const params = await this.mapSms(message)

			const command = new PublishCommand(params)

			const data = await client.send(command)

			this.logger.debug(`[${domain}] Result`, data)

			return data.$metadata.httpStatusCode === 200
		} catch (e: any) {
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
