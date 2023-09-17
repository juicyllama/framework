import { App } from '../../apps.entity'
import { Logger } from '@juicyllama/utils'

export async function precheckWordpress(domain: string, app: App, settings: any) {
	const logger = new Logger()

	try {
		//@ts-ignore
		const { WordpressUsersModule, WordpressUsersService, WordpressContext } = await import(
			'@juicyllama/app-wordpress'
		)
		const wordpressUsersModule = await this.lazyModuleLoader.load(() => WordpressUsersModule)
		const wordpressUsersService = wordpressUsersModule.get(WordpressUsersService)

		const result = await wordpressUsersService.findAll({
			arguments: {
				context: WordpressContext.edit,
			},
			config: settings,
		})

		if (!result) {
			logger.debug(`[${domain}][${app.integration_name}] Cannot authenticate with provided credentials`, result)
			return {
				result: false,
				error: `Authentication failed, please check your credentials and try again.`,
			}
		}
	} catch (e: any) {
		logger.debug(`[${domain}][${app.integration_name}] Error connecting to WordPress: ${e.message}`, e)
		return {
			result: false,
			error: `Error connecting to WordPress: ${e.message}`,
		}
	}

	return {
		result: true,
	}
}
