import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager'
import { Logger, Env } from '@juicyllama/utils'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AwsSecretsService {
	constructor(
		private readonly configService: ConfigService,
		private readonly logger: Logger,
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
