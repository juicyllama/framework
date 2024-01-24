import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager'
import { Env, Logger } from '@juicyllama/utils'
import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AwsSecretsService {
	constructor(
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
	) {}

	/**
	 * Set secrets from secrets manager
	 *
	 * @param {string} secret_name
	 */

	async getSecrets(secret_name: string): Promise<object> {
		const domain = 'app::aws::AwsSecretsService::getSecrets'

		this.logger.debug(`[${domain}] Get Secrets`, secret_name)

		const accessKeyId = this.configService.get<string>('aws.AWS_JL_ACCESS_KEY_ID')
		const secretAccessKey = this.configService.get<string>('aws.AWS_JL_SECRET_KEY_ID')
		if (!accessKeyId || !secretAccessKey) {
			throw new Error('AWS Credentials not set')
		}

		try {
			const client = new SecretsManagerClient({
				region: this.configService.get<string>('aws.AWS_S3_JL_REGION'),
				credentials: Env.IsProd() // Call the Env.IsProd() function instead of referencing it directly
					? undefined
					: {
							accessKeyId,
							secretAccessKey,
						},
			})

			const response = await client.send(
				new GetSecretValueCommand({
					SecretId: secret_name,
					VersionStage: 'AWSCURRENT', // VersionStage defaults to AWSCURRENT if unspecified
				}),
			)

			return JSON.parse(response.SecretString || '{}')
		} catch (e: any) {
			this.logger.error(
				`[${domain}] Error: ${e.message}`,
				e.response
					? {
							status: e.response.status,
							data: e.response.data,
						}
					: null,
			)
			throw e
		}
	}
}
