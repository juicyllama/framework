import {App} from "../../apps.entity";

export async function precheckWordpress(domain: string, app: App, settings: any) {

	try {
		//@ts-ignore
		const {WordpressUsersModule, WordpressUsersService, WordpressContext} = await import(
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
			this.logger.debug(
				`[${domain}][${app.integration_name}] Cannot authenticate with provided credentials`,
				result,
			)
			return {
				result: false,
				error: `Authentication failed, please check your credentials and try again.`,
			}
		}
	} catch (e: any) {
		this.logger.debug(
			`[${domain}][${app.integration_name}] Error connecting to WordPress: ${e.message}`,
			e,
		)
		return {
			result: false,
			error: `Error connecting to WordPress: ${e.message}`,
		}
	}

	return {
		result: true,
	}

}