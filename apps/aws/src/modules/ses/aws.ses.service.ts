import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Env, Logger, Markdown } from '@juicyllama/utils'
import { SESv2Client, SendEmailRequest, SendEmailCommand } from '@aws-sdk/client-sesv2'
import { ConfigService } from '@nestjs/config'
import type { BeaconMessageDto } from '@juicyllama/core'
import { S3ClientConfig } from '@aws-sdk/client-s3/dist-types/S3Client'

@Injectable()
export class AwsSesService {
	constructor(
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => Markdown)) private readonly markdown: Markdown,
	) {}

	/**
	 * Send an email using SES
	 *
	 * @param {BeaconMessageDto} message
	 */

	async send(message: BeaconMessageDto): Promise<boolean> {
		const domain = 'app::aws::ses::AwsSecretsService::send'

		this.logger.debug(`[${domain}] Send email`, message)

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return true
		}

		try {
			const client = new SESv2Client(<S3ClientConfig>{
				region:
					this.configService.get<string>('awsSes.AWS_SES_JL_REGION') ??
					this.configService.get<string>('aws.AWS_JL_REGION'),
				credentials: {
					accessKeyId: this.configService.get<string>('aws.AWS_JL_ACCESS_KEY_ID'),
					secretAccessKey: this.configService.get<string>('aws.AWS_JL_SECRET_KEY_ID'),
				},
			})

			const params = await this.mapEmail(message)

			const command = new SendEmailCommand(params)

			const data = await client.send(command)

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

	async mapEmail(message: BeaconMessageDto): Promise<SendEmailRequest> {
		const request = <SendEmailRequest>{
			FromEmailAddress: `${this.fromName(message)}<${this.fromEmail(message)}>`,
			Destination: {
				ToAddresses: [`${message.communication.email.to.name}<${message.communication.email.to.email}>`],
			},
			Content: {
				Simple: null,
				Template: null,
			},
		}

		if (!this.configService.get<string>('awsSes.AWS_SES_JL_TEMPLATE_ARN')) {
			return await this.mapEmailSimple(message, request)
		} else {
			return await this.mapEmailTemplate(message)
		}
	}

	async mapEmailSimple(message: BeaconMessageDto, request: SendEmailRequest): Promise<SendEmailRequest> {
		let text = message.markdown
		let markdown = message.markdown

		if (message.cta) {
			text += `
	
			${message.cta.url}`

			markdown += `
			
			[${message.cta.text}](${message.cta.url})`
		}

		request.Content.Simple = {
			Subject: {
				Data: message.subject,
			},
			Body: {
				Text: {
					Data: text,
				},
				Html: {
					Data: await this.markdown.markdownToHTML(markdown),
				},
			},
		}

		return request
	}

	async mapEmailTemplate(email: BeaconMessageDto): Promise<SendEmailRequest> {
		const domain = 'app::aws::ses::AwsSecretsService::mapEmailTemplate'
		this.logger.error(`[${domain}] Not Implemented`, email)
		return
	}

	private fromName(message: BeaconMessageDto): string {
		if (message?.communication?.email?.from?.name) {
			return message.communication.email.from.name
		}

		return this.configService.get<string>('system.SYSTEM_EMAIL_NAME')
	}

	private fromEmail(message: BeaconMessageDto): string {
		if (message?.communication?.email?.from?.email) {
			return message.communication.email.from.email
		}

		return this.configService.get<string>('system.SYSTEM_EMAIL_ADDRESS')
	}
}
