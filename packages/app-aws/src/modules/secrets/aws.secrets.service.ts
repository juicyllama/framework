import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Logger, Env } from '@juicyllama/utils'
import { ConfigService } from '@nestjs/config'
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager'

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

		try {
			const client = new SecretsManagerClient({
				region: this.configService.get<string>('aws.AWS_S3_JL_REGION'),
				credentials: Env.IsProd
					? undefined
					: {
							// we don't have/need these in AWS
							accessKeyId: this.configService.get<string>('aws.AWS_JL_ACCESS_KEY_ID'),
							secretAccessKey: this.configService.get<string>('aws.AWS_JL_SECRET_KEY_ID'),
					  },
			})

			const response = await client.send(
				new GetSecretValueCommand({
					SecretId: secret_name,
					VersionStage: 'AWSCURRENT', // VersionStage defaults to AWSCURRENT if unspecified
				}),
			)

			return JSON.parse(response.SecretString)
		} catch (e) {
			this.logger.error(
				`[${domain}] Error: ${e.message}`,
				e.response
					? {
							status: e.response.status,
							data: e.response.data,
					  }
					: null,
			)
			return
		}
	}
}
