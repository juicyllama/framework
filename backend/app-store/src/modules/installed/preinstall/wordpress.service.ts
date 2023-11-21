import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Logger, Modules } from '@juicyllama/utils'
import { LazyModuleLoader } from '@nestjs/core'
import { App } from '../../apps.entity'
import { preInstallCheckResponse } from '../installed.dto'

@Injectable()
export class WordPressService {
	constructor(
		@Inject(forwardRef(() => LazyModuleLoader)) private readonly lazyModuleLoader: LazyModuleLoader,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
	) {}

	async precheckWordpress(domain: string, app: App, settings: any): Promise<preInstallCheckResponse> {
		if (!Modules.isInstalled('@juicyllama/app-wordpress')) {
			return {
				result: false,
				error: `WordPress is not installed`,
			}
		}

		try {
			//@ts-ignore
			const { WordpressUsersModule, WordpressUsersService, WordpressContext } = await import(
				//@ts-ignore
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
