import { SecretsManagerClient, GetSecretValueCommand, ListSecretsCommand } from '@aws-sdk/client-secrets-manager'
import { Logger } from '@juicyllama/utils'
import { Injectable } from '@nestjs/common'
import { InjectSecretsManager } from './aws.secrets.constants'

@Injectable()
export class AwsSecretsService {
	constructor(
		private readonly logger: Logger,
		@InjectSecretsManager() private readonly secretsClient: SecretsManagerClient,
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
			const response = await this.secretsClient.send(
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

	async getSecret(secret_name: string): Promise<any> {
		const domain = 'app::aws::AwsSecretsService::getSecrets'

		this.logger.debug(`[${domain}] Get Secrets: `, secret_name)

		try {
			const response = await this.secretsClient.send(
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

	async listSecrets(): Promise<object> {
		const domain = 'app::aws::AwsSecretsService::getSecrets'

		this.logger.debug(`[${domain}] List Secrets: `)

		try {
			const response = await this.secretsClient.send(new ListSecretsCommand({}))

			return response.SecretList
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
