import { Logger, Env } from '@juicyllama/utils'
import { SecretsManagerClient, GetSecretValueCommand, ListSecretsCommand } from '@aws-sdk/client-secrets-manager'

export async function getSecret(secret_name: string): Promise<any> {
	const domain = 'app::aws::AwsSecretsService::getSecrets'

	const logger = new Logger()
	logger.debug(`[${domain}] Get Secrets: `, secret_name)

	try {
		const region = process.env.AWS_JL_REGION ?? 'eu-west-2'

		const config = {
			region: region,
			credentials: undefined,
		}

		//If inside AWS, we don't need to set credentials
		if (!Env.IsProd()) {
			config.credentials = {
				accessKeyId: process.env.AWS_JL_ACCESS_KEY_ID,
				secretAccessKey: process.env.AWS_JL_SECRET_KEY_ID,
			}
		}

		const client = new SecretsManagerClient(config)

		const response = await client.send(
			new GetSecretValueCommand({
				SecretId: secret_name,
				VersionStage: 'AWSCURRENT', // VersionStage defaults to AWSCURRENT if unspecified
			}),
		)

		return JSON.parse(response.SecretString)
	} catch (e: any) {
		logger.error(
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

export async function listSecrets(): Promise<object> {
	const domain = 'app::aws::AwsSecretsService::getSecrets'

	const logger = new Logger()
	logger.debug(`[${domain}] List Secrets: `)

	try {
		const region = process.env.AWS_JL_REGION ?? 'eu-west-2'

		const config = {
			region: region,
			credentials: undefined,
		}

		//If inside AWS, we don't need to set credentials
		if (!Env.IsProd()) {
			config.credentials = {
				accessKeyId: process.env.AWS_JL_ACCESS_KEY_ID,
				secretAccessKey: process.env.AWS_JL_SECRET_KEY_ID,
			}
		}

		const client = new SecretsManagerClient(config)

		const response = await client.send(new ListSecretsCommand({}))

		return response.SecretList
	} catch (e: any) {
		logger.error(
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
