import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { MoreThan, IsNull } from 'typeorm'
import { WebsitesService } from './websites.service'
import { SettingsService, StorageService, CronRunner, StorageType, StorageFileFormat } from '@juicyllama/core'
import { CRON_WEBSITES_WEBSITE_ICON_GENERATE_DOMAIN, CRON_WEBSITES_WEBSITE_SCREENSHOT_GENERATE_DOMAIN } from './websites.constants'
import { Logger, File } from '@juicyllama/utils'

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

			const location = `accounts/${website.account_id}/images/websites/${website.website_id}/screenshot.png`

			const promise = new Promise((res, rej) => {
						
						(import('capture-website'))
						.then((captureWebsite) => {

							captureWebsite.default.base64(website.url, {
								width: 1280,
								height: 1280,
								scaleFactor: 0.5,
							}).then((base64) => {

								File.createFileFromBase64(base64, 'screenshot.png').then((png) => {

									this.storageService.write({
										location: location,
										permissions: StorageType.PUBLIC,
										format: StorageFileFormat.Express_Multer_File,
										file: png,
									}).then((result) => {
										
										this.logger.log(`[${domain}][Website #${website.website_id}] Screenshot Generated & Saved`, result)
		
										this.websitesService.update({
												website_id: website.website_id,
												screenshot_url: result.url,
											}).then((result) => {
												this.logger.log(`[${domain}][Website #${website.website_id}] Screenshot URL Updated`, result)
												res(result)
											}).catch((e) => {
												this.logger.error(`[${domain}][Website #${website.website_id}] Screenshot URL Update Failed`, e)
												rej(e)
												return
											})
									}).catch((e) => {
										this.logger.error(`[${domain}][Website #${website.website_id}] Screenshot Generated & Saved Failed`, e)
										rej(e)
										return
									})
								}).catch((e) => {
									this.logger.error(`[${domain}][Website #${website.website_id}] Failed to convert base64 to file`, e)
									rej(e)
									return
								})
							}).catch((e) => {
								this.logger.error(`[${domain}][Website #${website.website_id}] Screenshot Generation Failed`, e)
								rej(e)
								return
							})
						})
						.catch((e) => {
							this.logger.error(`[${domain}][Website #${website.website_id}] Failed to import captureWebsite module`, e)
							rej(e)
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

			let location = `accounts/${website.account_id}/images/websites/${website.website_id}/`

			const promise = new Promise((res, rej) => {

				try {

					(import('get-website-favicon'))
					.then((getFavicons) => {

						getFavicons.default(website.url)
						.then((favicons) => {

							console.log(favicons)

							if(favicons?.icons.length === 0){
								this.logger.warn(`[${domain}][Website #${website.website_id}] No Icons Found`, favicons)
								rej(`No icons found for ${website.url}`)
								return
							}

							const icons = favicons.icons.sort((a, b) => {
								
								if(!a.sizes || a.sizes === '') {
									return 1
								}
								if(!b.sizes || b.sizes === '') {
									return -1
								}

								const aSize = a.sizes.split('x')[0]
								const bSize = b.sizes.split('x')[0]
								return bSize - aSize
							})

							File.downloadFile(icons[0].src)
							.then((file) => {

								location = `${location}/${file.filename}`

								this.storageService.write({
									location: location,
									permissions: StorageType.PUBLIC,
									format: StorageFileFormat.Express_Multer_File,
									file: file,
								}).then((result) => {
												
									this.logger.log(`[${domain}][Website #${website.website_id}] Icon Generated & Saved`, result)
				
									this.websitesService.update({
										website_id: website.website_id,
										icon_url: result.url,
									}).then((result) => {
											this.logger.log(`[${domain}][Website #${website.website_id}] Icon URL Updated`, result)
											res(result)
									}).catch((e) => {
										this.logger.error(`[${domain}][Website #${website.website_id}] Icon URL Update Failed`, {
											error: {
												message: e.message,
												stack: e.stack,
											}
										})
										rej(`Icon URL Update Failed - ${e.message}`)
										return
									})
								}).catch((e) => {
									this.logger.error(`[${domain}][Website #${website.website_id}] Failed to save icon to storage`, {
										error: {
											message: e.message,
											stack: e.stack,
										}
									})
									rej(`Failed to save icon to storage - ${e.message}`)
									return
								})
							}).catch((e) => {
								this.logger.error(`[${domain}][Website #${website.website_id}] Failed to download icon`, {
									error: {
										message: e.message,
										stack: e.stack,
									}
								})
								rej(`Failed to download icon: ${icons[0].src}`)
								return
							})
						})		
						.catch((e) => {
							this.logger.error(`[${domain}][Website #${website.website_id}] No icons found`, {
								error: {
									message: e.message,
									stack: e.stack,
								}
							})
							rej(` No icons found for ${website.url}`)
							return
						})
					})

					.catch((e) => {
						this.logger.error(`[${domain}][Website #${website.website_id}] Error importing 'get-website-favicon'`, {
							error: {
								message: e.message,
								stack: e.stack,
							}
						})
						rej(` Error importing 'get-website-favicon'`)
						return
					})


				} catch(e) {
					this.logger.error(`[${domain}][Website #${website.website_id}] Failed to generate icons`, {
						error: {
							message: e.message,
							stack: e.stack,
						}
					})
					rej(`Failed to generate icons for ${website.url}`)
					return
				}
			})

			promises.push(promise)
		}

		const outcomes = await Promise.allSettled(promises)

		// await this.settingsService.update(CRON_WEBSITES_WEBSITE_ICON_GENERATE_DOMAIN, {
		// 	website_id: websites[websites.length - 1].website_id,
		// })

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
