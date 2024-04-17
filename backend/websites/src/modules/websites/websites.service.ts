import {
	BaseService,
	BeaconService,
	InjectConfig,
	Query,
	StorageFileFormat,
	StorageService,
	StorageType,
} from '@juicyllama/core'
import { File, Logger } from '@juicyllama/utils'
import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { WebsitesConfigDto } from '../../config/websites.config.dto'
import { Website } from './websites.entity'

const E = Website
type T = Website

@Injectable()
export class WebsitesService extends BaseService<T> {
	constructor(
		@Inject(forwardRef(() => BeaconService)) readonly beaconService: BeaconService,
		@InjectConfig(WebsitesConfigDto) private readonly configService: WebsitesConfigDto,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => Query)) readonly query: Query<T>,
		@InjectRepository(E) readonly repository: Repository<T>,
		@Inject(forwardRef(() => StorageService)) private readonly storageService: StorageService,
	) {
		super(query, repository, {
			beacon: beaconService,
		})
	}

	async create(data: Partial<T>) {
		const website = await super.create(data)

		if (this.configService.CRON_WEBSITES_WEBSITE_SCREENSHOT_GENERATE) {
			await this.generateScreenshot(website)
		}

		if (this.configService.CRON_WEBSITES_WEBSITE_ICON_GENERATE) {
			try {
				await this.generateIcon(website)
			} catch (e: any) {
				this.logger.error(`[Website #${website.website_id}] Failed to generate icon`, {
					error: {
						message: e?.message,
						stack: e?.stack,
					},
				})
			}
		}

		return website
	}

	async generateScreenshot(website: Website) {
		const domain = 'websites::website::service::generateScreenshot'

		const location = `accounts/${website.account_id}/images/websites/${website.website_id}/screenshot.png`

		import('capture-website')
			.then(async captureWebsite => {
				const base64 = await captureWebsite.default.base64(website.url, {
					width: 1280,
					height: 1280,
					scaleFactor: 0.5,
				})

				if (!base64) {
					this.logger.warn(`[${domain}][Website #${website.website_id}] No Screenshot Found`, base64)
					throw new Error(`No screenshot found for ${website.url}`)
				}

				const png = await File.createFileFromBase64(base64, 'screenshot.png')

				if (!png) {
					this.logger.warn(
						`[${domain}][Website #${website.website_id}] Failed to create png from screenshot`,
						png,
					)
					throw new Error(`Failed to create png from screenshot for website ${website.url}`)
				}

				const result = await this.storageService.write({
					location: location,
					permissions: StorageType.PUBLIC,
					format: StorageFileFormat.Express_Multer_File,
					file: png,
				})

				if (!result?.url) {
					this.logger.warn(
						`[${domain}][Website #${website.website_id}] Failed to upload file to storage`,
						result,
					)
					throw new Error(`ailed to upload file to storage`)
				}

				this.logger.log(`[${domain}][Website #${website.website_id}] Screenshot Generated & Saved`, result)

				website = await this.update({
					website_id: website.website_id,
					screenshot_url: result.url,
				})

				this.logger.log(`[${domain}][Website #${website.website_id}] Screenshot URL Updated`, result)
				return website
			})
			.catch(error => {
				throw new Error(error.message)
			})
	}

	async generateIcon(website: Website) {
		const domain = 'websites::website::service::generateIcon'

		let location = `accounts/${website.account_id}/images/websites/${website.website_id}`

		//@ts-ignore
		import('get-website-favicon').then(async getFavicons => {
			const favicons = await getFavicons.default(website.url)

			if (favicons?.icons.length === 0) {
				this.logger.warn(`[${domain}][Website #${website.website_id}] No Icons Found`, favicons)
				throw new Error(`No icons found for ${website.url}`)
			}

			const icons = favicons.icons.sort((a: any, b: any) => {
				if (!a.sizes || a.sizes === '') {
					return 1
				}
				if (!b.sizes || b.sizes === '') {
					return -1
				}

				const aSize = a.sizes.split('x')[0]
				const bSize = b.sizes.split('x')[0]
				return bSize - aSize
			})

			const file = await File.downloadFile(icons[0].src)

			if (!file) {
				this.logger.warn(`[${domain}][Website #${website.website_id}] Failed to create file from icon`, file)
				throw new Error(`Failed to create file from icon for website ${website.url}`)
			}

			location = `${location}/${file.filename}`

			const result = await this.storageService.write({
				location: location,
				permissions: StorageType.PUBLIC,
				format: StorageFileFormat.Express_Multer_File,
				file: file,
			})

			if (!result?.url) {
				this.logger.warn(`[${domain}][Website #${website.website_id}] Failed to upload file to storage`, result)
				throw new Error(`ailed to upload file to storage`)
			}

			this.logger.log(`[${domain}][Website #${website.website_id}] Icon Generated & Saved`, result)

			return await this.update({
				website_id: website.website_id,
				icon_url: result.url,
			})
		})
	}
}
