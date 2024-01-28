import { CachePeriod, Env, JLCache, Logger, Modules } from '@juicyllama/utils'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { LazyModuleLoader } from '@nestjs/core'
import { Cache } from 'cache-manager'
import { StorageWriteResponseDto } from './storage.dto'
import { StorageFileFormat, StorageFileType } from './storage.enums'

@Injectable()
export class StorageService {
	constructor(
		private readonly logger: Logger,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
		private readonly lazyModuleLoader: LazyModuleLoader,
	) {}

	/**
	 * Writes a file to storage
	 *
	 * @param {
	 *  	{String} location where in the file should be saved
	 *  	{StorageFileType} permissions the type of file
	 *  	{StorageFileFormat} format the file format we are working with
	 *  	{any} file the file contents to create (blob, json etc)
	 * 		{object} params additional params to pass to the s3 client
	 * } options
	 */

	async write(options: {
		location: string
		permissions: StorageFileType
		format?: StorageFileFormat
		file: Blob | Express.Multer.File | any
		params?: object
	}): Promise<StorageWriteResponseDto | undefined> {
		const domain = 'common::storage::write'

		if (Env.IsTest()) {
			this.logger.verbose(`[${domain}] Skipping as testing`)
			return
		}

		this.logger.debug(`[${domain}] Create File: ${options.location}`)

		if (options.format && options.format === StorageFileFormat.Express_Multer_File) {
			//convert to blob
			options.file = <Express.Multer.File>options.file
			options.file = options.file.buffer
			options.format = StorageFileFormat.BLOB
		}

		const cache_key = JLCache.cacheKey(domain, { location: options.location, permissions: options.permissions })
		await this.cacheManager.del(cache_key)
		await this.cacheManager.set(cache_key, options.file, CachePeriod.MONTH)

		let service: any

		if (Modules.aws.isInstalled) {
			const { AwsS3Module, AwsS3Service } = await Modules.aws.load()

			try {
				const awsS3Module = await this.lazyModuleLoader.load(() => AwsS3Module)
				service = awsS3Module.get(AwsS3Service)
				const s3Result = await service.create({
					location: options.location,
					bucket: options.permissions,
					format: options.format ?? StorageFileFormat.BLOB,
					file: options.file,
					params: options.params,
				})

				return {
					success: true,
					url: s3Result.Location,
				}
			} catch (e: any) {
				this.logger.error(`[${domain}] ${e.message}`, e)
				return {
					success: false,
					error: e.message,
				}
			}
		}

		if (!service) {
			this.logger.error(`No storage app installed, options are: @juicyllama/app-aws`)
			return {
				success: false,
			}
		}
	}

	/**
	 * List files
	 *
	 * @param {
	 *  	{String} location where in the file should be saved
	 *  	{StorageFileType} permissions the type of file
	 * } options
	 */

	async list(location: string, permissions: StorageFileType): Promise<any> {
		const domain = 'common::storage::list'

		this.logger.debug(`[${domain}] list`)

		let service: any

		if (Modules.aws.isInstalled) {
			const { AwsS3Module, AwsS3Service } = await Modules.aws.load()
			const awsS3Module = await this.lazyModuleLoader.load(() => AwsS3Module)
			service = awsS3Module.get(AwsS3Service)
			return await service.findAll({ location: location, bucket: permissions })
		}

		if (!service) {
			this.logger.error(`[${domain}] No storage app installed`)
			return false
		}
	}

	/**
	 * Return a file
	 *
	 * @param {
	 *  	{String} location where in the file should be saved
	 *  	{StorageFileType} permissions the type of file
	 *  	{StorageFileFormat} format the file format we are working with
	 * } options
	 */

	async read(
		location: string,
		permissions: StorageFileType,
		format: StorageFileFormat = StorageFileFormat.BLOB,
	): Promise<any> {
		const domain = 'common::storage::read'

		this.logger.debug(`[${domain}] Read`)

		const cache_key = JLCache.cacheKey(domain, { location: location, permissions: permissions })

		let file = await this.cacheManager.get(cache_key)
		if (file) {
			this.logger.debug(`[${domain}] Returned from cache: ${location}`)
			return file
		}

		let service: any

		if (Modules.aws.isInstalled) {
			const { AwsS3Module, AwsS3Service } = await Modules.aws.load()
			const awsS3Module = await this.lazyModuleLoader.load(() => AwsS3Module)
			service = awsS3Module.get(AwsS3Service)
			file = await service.findOne({ location: location, bucket: permissions, format: format })
		}

		if (!service) {
			this.logger.error(`[${domain}] No storage app installed`)
			return false
		}

		if (!file) {
			this.logger.error(`[${domain}] No file found: ${location}`)
			return false
		}

		await this.cacheManager.set(cache_key, file, CachePeriod.MONTH)
		return file
	}

	/**
	 * Deletes a file
	 *
	 * @param {
	 *  	{String} location where in the file should be saved
	 *  	{StorageFileType} permissions the type of file
	 * } options
	 */

	async del(location: string, permissions: StorageFileType): Promise<any> {
		const domain = 'common::storage::del'

		this.logger.debug(`[${domain}] Delete file: ${location}`)

		const cache_key = JLCache.cacheKey(domain, { location: location, permissions: permissions })
		await this.cacheManager.del(cache_key)

		let service: any

		if (Modules.aws.isInstalled) {
			const { AwsS3Module, AwsS3Service } = await Modules.aws.load()
			const awsS3Module = await this.lazyModuleLoader.load(() => AwsS3Module)
			service = awsS3Module.get(AwsS3Service)
			await service.remove({ location: location, bucket: permissions })
			return true
		}

		if (!service) {
			this.logger.error(`[${domain}] No storage app installed`)
			return false
		}
	}
}
