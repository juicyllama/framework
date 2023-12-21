import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { MoreThan, IsNull } from 'typeorm'
import { WebsitesService } from './websites.service'
import { SettingsService, StorageService, CronRunner, StorageType, StorageFileFormat } from '@juicyllama/core'
import { CRON_WEBSITES_WEBSITE_ICON_GENERATE_DOMAIN, CRON_WEBSITES_WEBSITE_SCREENSHOT_GENERATE_DOMAIN } from './websites.constants'
import { Logger } from '@juicyllama/utils'

@Injectable()
export class WebsitesCronsService {
	constructor(
		@Inject(forwardRef(() => SettingsService)) private readonly settingsService: SettingsService,
		@Inject(forwardRef(() => StorageService)) private readonly storageService: StorageService,
		@Inject(forwardRef(() => WebsitesService)) readonly websitesService: WebsitesService,
		@Inject(forwardRef(() => Logger)) readonly logger: Logger,
	) {}

	/**
	 * Takes a list of websites without screenshots and generates them
	 */

	@Cron(process.env.CRON_WEBSITES_WEBSITE_SCREENSHOT_GENERATE_FREQUENCY ?? CronExpression.EVERY_MINUTE, {
		disabled: !process.env.CRON_WEBSITES_WEBSITE_SCREENSHOT_GENERATE,
	})
	async cronGenerateWebsiteScreenshots() {
		return await CronRunner(CRON_WEBSITES_WEBSITE_SCREENSHOT_GENERATE_DOMAIN, this.generateWebsiteScreenshots())
	}

	/**
	 * Takes a list of websites without icons and saves them
	 */

	@Cron(process.env.CRON_WEBSITES_WEBSITE_ICON_GENERATE_FREQUENCY ?? CronExpression.EVERY_MINUTE, {
		disabled: !process.env.CRON_WEBSITES_WEBSITE_ICON_GENERATE,
	})
	async cronGenerateWebsiteIcons() {
		return await CronRunner(CRON_WEBSITES_WEBSITE_ICON_GENERATE_DOMAIN, this.generateWebsiteIcons())
	}

	async generateWebsiteScreenshots() {

		const domain = CRON_WEBSITES_WEBSITE_SCREENSHOT_GENERATE_DOMAIN

		const defaultResult = {
			websites: {
				total: 0,
				success: 0,
				failed: 0,
				failures: [],
			}
		}

		let last_check_at = await this.settingsService.findValue(CRON_WEBSITES_WEBSITE_SCREENSHOT_GENERATE_DOMAIN)
		if(!last_check_at?.website_id){
			last_check_at = {
				website_id: 0
			}
		}

		const websites = await this.websitesService.findAll({
			where: {
				website_id: MoreThan(last_check_at.website_id),
				screenshot_url: IsNull(),
			},
			order: {
				website_id: 'ASC',
			},
			take: 10,
		})

		this.logger.log(`[${domain}] ${websites.length} Wesbites Found`)

		if (websites.length === 0) {
			return defaultResult
		}

		const promises = []

		for (const website of websites) {
			
			const promise = new Promise((res, rej) => {
				this.websitesService.generateScreenshot(website).then((result) => {
					res(result)
				}).catch((e) => {
					this.logger.error(`[${domain}][Website #${website.website_id}] Failed to generate screenshot`, {
						error: {
							message: e.message,
							stack: e.stack,
						}
					})
					rej(`Failed to generate screenshot for ${website.url}`)
					return
				})
			})
			promises.push(promise)
		}

		const outcomes = await Promise.allSettled(promises)

		await this.settingsService.update(CRON_WEBSITES_WEBSITE_SCREENSHOT_GENERATE_DOMAIN, {
			website_id: websites[websites.length - 1].website_id,
		})

		return {
			websites: {
				total: websites.length,
				success: outcomes.filter(o => o.status === 'fulfilled').length,
				failed: outcomes.filter(o => o.status === 'rejected').length,
				failures: outcomes.filter(o => o.status === 'rejected'),
			},
		}

	}

	async generateWebsiteIcons() {

		const domain = CRON_WEBSITES_WEBSITE_ICON_GENERATE_DOMAIN

		const defaultResult = {
			websites: {
				total: 0,
				success: 0,
				failed: 0,
				failures: [],
			}
		}

		let last_check_at = await this.settingsService.findValue(CRON_WEBSITES_WEBSITE_ICON_GENERATE_DOMAIN)
		if(!last_check_at?.website_id){
			last_check_at = {
				website_id: 0
			}
		}

		const websites = await this.websitesService.findAll({
			where: {
				website_id: MoreThan(last_check_at.website_id),
				icon_url: IsNull(),
			},
			order: {
				website_id: 'ASC',
			},
			take: 10,
		})

		this.logger.log(`[${domain}] ${websites.length} Wesbites Found`)

		if (websites.length === 0) {
			return defaultResult
		}

		const promises = []

		for (const website of websites) {

			
			const promise = new Promise((res, rej) => {

				this.websitesService.generateIcon(website).then((result) => {
					res(result)
				}).catch((e) => {
					this.logger.error(`[${domain}][Website #${website.website_id}] Failed to generate icon`, {
						error: {
							message: e.message,
							stack: e.stack,
						}
					})
					rej(`Failed to generate icon for ${website.url}`)
					return
				})

			})

			promises.push(promise)
		}

		const outcomes = await Promise.allSettled(promises)

		await this.settingsService.update(CRON_WEBSITES_WEBSITE_ICON_GENERATE_DOMAIN, {
		 	website_id: websites[websites.length - 1].website_id,
		})

		return {
			websites: {
				total: websites.length,
				success: outcomes.filter(o => o.status === 'fulfilled').length,
				failed: outcomes.filter(o => o.status === 'rejected').length,
				failures: outcomes.filter(o => o.status === 'rejected'),
			},
		}

	}


}
