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
		} else {
			const cache_key = JLCache.cacheKey(domain, { location: options.location, permissions: options.permissions })
			await this.cacheManager.del(cache_key)
			await this.cacheManager.set(cache_key, options.file, CachePeriod.MONTH)
		}

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
	): Promise<Express.Multer.File | string | undefined> {
		const domain = 'common::storage::read'

		this.logger.debug(`[${domain}] Read`)
		let file

		const cache_key = JLCache.cacheKey(domain, { location: location, permissions: permissions })

		if (format !== StorageFileFormat.Express_Multer_File) {
			file = await this.cacheManager.get(cache_key)
			if (file) {
				this.logger.debug(`[${domain}] Returned from cache: ${location}`)
				return <string>file
			}
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
			return
		}

		if (!file) {
			this.logger.error(`[${domain}] No file found: ${location}`)
			return
		}

		if (format !== StorageFileFormat.Express_Multer_File) {
			await this.cacheManager.set(cache_key, file, CachePeriod.MONTH)
		}

		return file
	}

	/**
	 * Return a signed URL for a private file
	 *
	 * @param {
	 *  	{String} location where in the file should be saved
	 *  	{StorageFileType} permissions the type of file
	 *  	{expiresIn} time in seconds the URL should be valid
	 * } options
	 */

	async getSignedUrl(
		location: string,
		permissions: StorageFileType,
		expiresIn?: number,
	): Promise<string | undefined> {
		const domain = 'common::storage::getSignedUrl'

		this.logger.debug(`[${domain}] getSignedUrl`, {
			location,
			permissions,
			expiresIn,
		})

		let url: string | undefined
		let service: any

		if (Modules.aws.isInstalled) {
			const { AwsS3Module, AwsS3Service } = await Modules.aws.load()
			const awsS3Module = await this.lazyModuleLoader.load(() => AwsS3Module)
			service = awsS3Module.get(AwsS3Service)
			url = await service.getSignedUrl({ location: location, bucket: permissions, expiresIn: expiresIn })
		}

		if (!service) {
			this.logger.error(`[${domain}] No storage app installed`)
			return
		}

		if (!url) {
			this.logger.error(`[${domain}] No file found: ${location}`)
			return
		}
		return url
	}

	/**
	 * Return a signed URL for a bucket url
	 *
	 * @param {
	 *  	{String} url of the file needed signing
	 *  	{expiresIn} time in seconds the URL should be valid
	 * } options
	 */

	async getSignedUrlByUrl(url: string, expiresIn?: number): Promise<string> {
		const domain = 'common::storage::getSignedUrlByUrl'

		this.logger.debug(`[${domain}] getSignedUrlByUrl`, {
			url,
			expiresIn,
		})

		let result = ''
		let service: any

		if (Modules.aws.isInstalled) {
			const { AwsS3Module, AwsS3Service } = await Modules.aws.load()
			const awsS3Module = await this.lazyModuleLoader.load(() => AwsS3Module)
			service = awsS3Module.get(AwsS3Service)
			result = await service.getSignedUrl({ url, expiresIn })
		}

		if (!service) {
			this.logger.error(`[${domain}] No storage app installed`)
		}

		if (!result) {
			this.logger.error(`[${domain}] No file found`)
		}

		return result
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
