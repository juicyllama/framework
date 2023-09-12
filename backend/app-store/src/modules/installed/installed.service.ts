import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { InstalledApp } from './installed.entity'
import { BaseService, BeaconService, Query } from '@juicyllama/core'
import { AppsService } from '../apps.service'
import { AppIntegrationType, AppStoreIntegrationName } from '../apps.enums'
import { Logger, Modules } from '@juicyllama/utils'
import { App } from '../apps.entity'
import { LazyModuleLoader } from '@nestjs/core'

export const E = InstalledApp
export type T = InstalledApp

@Injectable()
export class InstalledAppsService extends BaseService<T> {
	constructor(
		@InjectRepository(E) readonly repository: Repository<T>,
		@Inject(forwardRef(() => Query)) readonly query: Query<T>,
		@Inject(forwardRef(() => BeaconService)) readonly beaconService: BeaconService,
		@Inject(forwardRef(() => AppsService)) readonly appsService: AppsService,
		@Inject(forwardRef(() => LazyModuleLoader)) private readonly lazyModuleLoader: LazyModuleLoader,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
	) {
		super(query, repository, {
			beacon: beaconService,
		})
	}

	/**
	 * Strips all non-public credentials form the AccountApp
	 *
	 * @param {InstalledApp} installed_app
	 */

	async removePrivateSettings(installed_app: InstalledApp): Promise<InstalledApp> {
		if (!installed_app.app || !installed_app.app.app_id) {
			installed_app.app = await this.appsService.findOne({ where: { app_id: installed_app.app_id } })
		}

		const public_settings = {}
		if (installed_app.app.integration_type === AppIntegrationType.CREDENTIALS && installed_app.app?.settings) {
			for (const app_creds of installed_app.app.settings) {
				if (!app_creds.private) {
					if (installed_app.settings && installed_app.settings[app_creds.key]) {
						public_settings[app_creds.key] = installed_app.settings[app_creds.key]
					}
				}
			}
		}

		installed_app.settings = <any>public_settings
		return installed_app
	}

	//TODO implement when we have our first oauth2 app integration
	async createOauthLink(installed_app: T): Promise<T> {
		switch (installed_app.app.integration_name) {
			default:
				//throw new NotImplementedException(`${installed_app.app.integration_name} OAUTH2 LINK NOT IMPLEMENTED`)
				return installed_app
		}
	}

	//Check if app passes the installation checks
	// result = true - all passed
	// result = false - failed checks & error contains error message
	async preInstallChecks(app: App, settings: any): Promise<{ result: boolean; error?: string }> {
		const domain = 'app::installed::preInstallChecks'
		this.logger.debug(`[${domain}][${app.integration_name}] Checking app #${app.app_id} for pre-install checks`)

		//ensure app is installed
		switch (app.integration_name) {
			case AppStoreIntegrationName.wordpress:
				if (!Modules.isInstalled('@juicyllama/app-wordpress')) {
					this.logger.debug(`[${domain}][${app.integration_name}] App not installed`)
					return {
						result: false,
						error: `App not installed`,
					}
				}
				break
		}

		//if app can validate credentials, do so
		switch (app.integration_name) {
			case AppStoreIntegrationName.wordpress:
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
	}
}
