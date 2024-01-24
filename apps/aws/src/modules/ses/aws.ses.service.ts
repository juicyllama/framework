import { S3ClientConfig } from '@aws-sdk/client-s3/dist-types/S3Client'
import { SendEmailCommand, SendEmailRequest, SESv2Client } from '@aws-sdk/client-sesv2'
import type { BeaconMessageDto } from '@juicyllama/core'
import { Env, Logger, Markdown } from '@juicyllama/utils'
import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

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
		const domain = 'app::aws::ses::AwsSesService::send'

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

	async mapEmail(message: BeaconMessageDto): Promise<SendEmailRequest> {
		const to = message.communication.email?.to
		if (!to) {
			throw new Error('No to address set')
		}
		const request = <SendEmailRequest>{
			FromEmailAddress: `${this.fromName(message)}<${this.fromEmail(message)}>`,
			Destination: {
				ToAddresses: [`${to.name}<${to.email}>`],
			},
			Content: {
				Simple: undefined,
				Template: undefined,
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

		request.Content ||= {}

		request.Content.Simple = {
			Subject: {
				Data: message.subject,
			},
			Body: {
				Text: {
					Data: text,
				},
				...(markdown && {
					Html: {
						Data: await this.markdown.markdownToHTML(markdown),
					},
				}),
			},
		}

		return request
	}

	async mapEmailTemplate(email: BeaconMessageDto): Promise<SendEmailRequest> {
		const domain = 'app::aws::ses::AwsSesService::mapEmailTemplate'
		this.logger.error(`[${domain}] Not Implemented`, email)
		throw new Error('Not Implemented')
	}

	private fromName(message: BeaconMessageDto): string {
		if (message?.communication?.email?.from?.name) {
			return message.communication.email.from.name
		}

		const val = this.configService.get<string>('system.SYSTEM_EMAIL_NAME')
		if (!val) {
			throw new Error('No from name set')
		}
		return val
	}

	private fromEmail(message: BeaconMessageDto): string {
		if (message?.communication?.email?.from?.email) {
			return message.communication.email.from.email
		}

		const val = this.configService.get<string>('system.SYSTEM_EMAIL_ADDRESS')
		if (!val) {
			throw new Error('No from email set')
		}
		return val
	}
}
