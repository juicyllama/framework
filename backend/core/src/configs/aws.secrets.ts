import { Env, Logger, Modules } from '@juicyllama/utils'

export async function loadEnvVariables(SECRET_MANAGER_NAME: string, envPath: string): Promise<any> {
	const logger = new Logger()

	try {
		if (!Modules.aws.isInstalled) {
			new Error('[loadEnvVariables] AWS Module not installed')
		}
		//@ts-ignore
		const { getSecret } = await Modules.aws.load()
		const secrets = await getSecret(SECRET_MANAGER_NAME)

		if (!secrets) {
			logger.error(`[loadEnvVariables] No secrets found for ${SECRET_MANAGER_NAME}`)
		}

		for (const [key, value] of Object.entries(secrets)) {
			process.env[key] = <string>value
			Env.setEnvValue({
				key: key,
				value: <string>value,
				envPath: envPath,
			})
			logger.debug(`[loadEnvVariables] Added key ${key} to process.env`)
		}

		return secrets
	} catch (e) {
		logger.error(`[loadEnvVariables] ${e.message}`, e.stack)
	}
}
