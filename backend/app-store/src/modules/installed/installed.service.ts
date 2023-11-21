import { forwardRef, Inject, Injectable, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { InstalledApp } from './installed.entity'
import { BaseService, BeaconService, Query } from '@juicyllama/core'
import { AppsService } from '../apps.service'
import { AppStoreIntegrationName } from '../apps.enums'
import { Logger } from '@juicyllama/utils'
import { App } from '../apps.entity'
import { CreateInstalledAppDto, preInstallCheckResponse } from './installed.dto'
import { WordPressService } from './preinstall/wordpress.service'
import { ShopifyService } from './preinstall/shopify.service'

export const E = InstalledApp
export type T = InstalledApp

@Injectable()
export class InstalledAppsService extends BaseService<T> {
	constructor(
		@InjectRepository(E) readonly repository: Repository<T>,
		@Inject(forwardRef(() => Query)) readonly query: Query<T>,
		@Inject(forwardRef(() => BeaconService)) readonly beaconService: BeaconService,
		@Inject(forwardRef(() => AppsService)) readonly appsService: AppsService,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => WordPressService)) readonly wordPressService: WordPressService,
		@Inject(forwardRef(() => ShopifyService)) readonly shopifyService: ShopifyService,
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
		if (installed_app.app?.settings) {
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

	/**
	 * Returns the redirection URL to kick off the OAUTH2 flow
	 * @param installed_app
	 * @returns string
	 */
	createOauthLink(installed_app: T): string {
		switch (installed_app.app.integration_name) {
			case AppStoreIntegrationName.shopify:
				return `${process.env.BASE_URL_API}/app/shopify/auth/install?installed_app_id=${installed_app.installed_app_id}`

			default:
				throw new BadRequestException(`${installed_app.app.integration_name} OAUTH2 LINK NOT IMPLEMENTED`)
		}
	}

	async checkRequiredSettings(installed_app: CreateInstalledAppDto): Promise<boolean> {
		const app = await this.appsService.findOne({ where: { app_id: installed_app.app_id } })

		if (!app) {
			throw new BadRequestException(`No app found with that app_id`)
		}

		if (!app.settings) {
			return true
		}

		for (const setting of app.settings) {
			if (setting.input.required) {
				if (!installed_app.settings || !installed_app.settings[setting.key]) {
					return false
				}
			}
		}

		return true
	}

	//Check if app passes the installation checks
	// result = true - all passed
	// result = false - failed checks & error contains error message
	async preInstallChecks(app: App, settings: any, account_id: number): Promise<preInstallCheckResponse> {
		const domain = 'app::installed::preInstallChecks'
		this.logger.debug(`[${domain}][${app.integration_name}] Checking app #${app.app_id} for pre-install checks`)

		switch (app.integration_name) {
			case AppStoreIntegrationName.wordpress:
				return await this.wordPressService.precheckWordpress(domain, app, settings)
			
			case AppStoreIntegrationName.shopify:
				return await this.shopifyService.precheckShopify(domain, app, settings, account_id)
			
			default:
				return {
					result: true,
				}
		}
	}

}
