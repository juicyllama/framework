import { SESv2Client, SendEmailCommand, SendEmailRequest } from '@aws-sdk/client-sesv2'
import { InjectConfig, type BeaconMessageDto } from '@juicyllama/core'
import { Env, Logger, Markdown } from '@juicyllama/utils'
import { Injectable, forwardRef, Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectSes } from './aws.ses.constants'
import { AwsSesConfigDto } from './config/aws.ses.config.dto'

@Injectable()
export class AwsSesService {
	constructor(
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => Markdown)) private readonly markdown: Markdown,
		@InjectConfig(AwsSesConfigDto) private readonly sesConfig: AwsSesConfigDto,
		@InjectSes() private readonly sesClient: SESv2Client,
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
			const params = await this.mapEmail(message)

			const command = new SendEmailCommand(params)

			const data = await this.sesClient.send(command)

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

		if (!this.sesConfig.AWS_SES_JL_TEMPLATE_ARN) {
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
				Html: {
					Data: markdown ? await this.markdown.markdownToHTML(markdown) : undefined,
				},
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
		const emailName = this.configService.get<string>('SYSTEM_EMAIL_NAME')
		if (emailName) {
			return emailName
		}
		throw new Error('No SYSTEM_EMAIL_NAME set')
	}

	private fromEmail(message: BeaconMessageDto): string {
		if (message?.communication?.email?.from?.email) {
			return message.communication.email.from.email
		}
		const email = this.configService.get<string>('SYSTEM_EMAIL_ADDRESS')
		if (email) {
			return email
		}
		throw new Error('No SYSTEM_EMAIL_ADDRESS set')
	}
}
