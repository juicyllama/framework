import { Logger, Modules } from '@juicyllama/utils'
import { Injectable } from '@nestjs/common'
import { LazyModuleLoader } from '@nestjs/core'
import { App } from '../../apps.entity'
import { preInstallCheckResponse } from '../installed.dto'

@Injectable()
export class WordPressService {
	constructor(
		private readonly lazyModuleLoader: LazyModuleLoader,
		private readonly logger: Logger,
	) {}

	async precheckWordpress(domain: string, app: App, settings: any): Promise<preInstallCheckResponse> {
		if (!Modules.wordpress.isInstalled) {
			return {
				result: false,
				error: `WordPress is not installed`,
			}
		}

		try {
			const { WordpressUsersModule, WordpressUsersService, WordpressContext } = await Modules.wordpress.load()
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
			this.logger.debug(`[${domain}][${app.integration_name}] Error connecting to WordPress: ${e.message}`, e)
			return {
				result: false,
				error: `Error connecting to WordPress: ${e.message}`,
			}
		}

		return {
			result: true,
		}
	}
}
