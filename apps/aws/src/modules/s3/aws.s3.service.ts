import {
	DeleteObjectCommand,
	GetObjectCommand,
	ListObjectsCommand,
	PutObjectCommandInput,
	S3Client,
	ServiceInputTypes,
	ServiceOutputTypes,
} from '@aws-sdk/client-s3'
import { getSignedUrl, S3RequestPresigner } from '@aws-sdk/s3-request-presigner'
import { Upload, Configuration } from '@aws-sdk/lib-storage'
import { getApplyMd5BodyChecksumPlugin } from '@smithy/middleware-apply-body-checksum'
import { Readable } from 'stream'
import { InjectS3 } from './aws.s3.constants'
import { AwsS3Bucket, AwsS3BucketType, AwsS3Format } from './aws.s3.enums'
import { AwsS3ConfigDto } from './config/aws.s3.config.dto'
import { Injectable } from '@nestjs/common'
import { InjectConfig } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { HttpRequest } from '@aws-sdk/protocol-http'
import { parseUrl } from '@aws-sdk/url-parser'
import { Hash } from '@aws-sdk/hash-node'
import { formatUrl } from '@aws-sdk/util-format-url'
import { MiddlewareStack } from '@aws-sdk/types';

function streamToString(stream: Readable): Promise<string> {
	return new Promise((resolve, reject) => {
		const chunks: Buffer[] = []
		stream.on('data', (chunk: Buffer) => chunks.push(chunk))
		stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')))
		stream.on('error', (error: Error) => reject(error))
	})
}

@Injectable()
export class AwsS3Service {
	constructor(
		private readonly logger: Logger,
		@InjectS3() private readonly s3Client: S3Client,
		@InjectConfig(AwsS3ConfigDto) private readonly s3Config: AwsS3ConfigDto,
	) {}

	/**
	 * Writes the content to S3
	 *
	 * @param {
	 * 		{String} location where in the bucket to store the file
	 * 		{AwsS3Bucket} bucket the bucket to access
	 * 		{AwsS3Format} format the file format we are working with
	 * 		{any} file the file contents to create (blob, json etc)
	 * 		{object} params additional params to pass to the s3 client
	 * } options
	 */

	async create(options: {
		location: string
		bucket: AwsS3Bucket
		format?: AwsS3Format
		file: any
		params?: PutObjectCommandInput
		sizing?: Configuration
	}): Promise<any> {
		const domain = 'app::aws::s3::AwsSecretsService::create'

		this.logger.debug(`[${domain}][${this.getBucket(options.bucket)}] create: ${options.location}`)

		if (options.format) {
			switch (options.format) {
				case AwsS3Format.JSON:
					options.file = Buffer.from(JSON.stringify(options.file))
					break
			}
		}

		try {
			this.s3Client.middlewareStack.use(getApplyMd5BodyChecksumPlugin(this.s3Client.config) as any as MiddlewareStack<ServiceInputTypes, ServiceOutputTypes>);
			
			const params = {
				Bucket: this.getBucket(options.bucket),
				Key: options.location,
				Body: options.file,
				...options.params,
			}

			if (!options.sizing) {
				options.sizing = <Configuration>{
					queueSize: 4,
					partSize: 1024 * 1024 * 5,
					leavePartsOnError: false,
				}
			}

			const upload = new Upload({
				client: this.s3Client,
				params,			
				...options.sizing,
			})

			upload.on('httpUploadProgress', progress => {
				this.logger.debug(`[${domain}][${this.getBucket(options.bucket)}] Progress: `, progress)
			})

			return await upload.done()
		} catch (e: any) {
			this.logger.warn(
				`[${domain}] Error: ${e.message}`,
				e.response
					? {
							status: e.response.status,
							data: e.response.data,
							options: options,
						}
					: null,
			)
			return false
		}
	}

	/**
	 * List files in a s3 directory
	 *
	 * @param {
	 * 		{String} location where in the bucket to store the file
	 * 		{AwsS3Bucket} bucket the bucket to access
	 * } options
	 */

	async findAll(options: { location: string; bucket: AwsS3Bucket }): Promise<any> {
		const domain = 'app::aws::s3::AwsSecretsService::findAll'

		this.logger.debug(`[${domain}][${this.getBucket(options.bucket)}] ${options.location}`)

		const command = new ListObjectsCommand({
			Bucket: this.getBucket(options.bucket),
			Prefix: options.location,
		})
		const data = await this.s3Client.send(command)

		const files = []

		if (data && data.Contents) {
			for (const file of data.Contents) {
				let fileName = file.Key
				if (!fileName) {
					this.logger.warn(`[${domain}] No file name found`)
					continue
				}
				fileName = fileName.replace(options.location, '')
				files.push(fileName)
			}
		}

		this.logger.debug(`[${domain}][${this.getBucket(options.bucket)}] ${files.length} files found`)
		return files
	}

	/**
	 * Return the content from S3
	 *
	 * @param {
	 * 		{String} location where in the bucket to store the file
	 * 		{AwsS3Bucket} bucket the bucket to access
	 * 		{AwsS3Format} format the file format we are working with
	 * } options
	 */

	async findOne(options: {
		location: string
		bucket: AwsS3Bucket
		format: AwsS3Format
	}): Promise<Express.Multer.File | string | undefined> {
		const domain = 'app::aws::s3::AwsSecretsService::findOne'

		this.logger.debug(`[${domain}][${this.getBucket(options.bucket)}] ${options.location}`)

		const command = new GetObjectCommand({
			Bucket: this.getBucket(options.bucket),
			Key: options.location,
		})

		let result

		try {
			const data = await this.s3Client.send(command)
			if (data.Body && data.Body instanceof Readable) {
				result = await streamToString(data.Body)
			} else {
				throw new Error('No body found in response')
			}
		} catch (e: any) {
			this.logger.warn(
				`[${domain}] Error: ${e.message}`,
				e.response
					? {
							status: e.response.status,
							data: e.response.data,
							options: options,
						}
					: null,
			)
			return
		}

		if (!result) {
			this.logger.debug(`[${domain}] No file found`)
			return
		}

		this.logger.debug(`[${domain}] File found`)

		if (options.format) {
			switch (options.format) {
				case AwsS3Format.Express_Multer_File: {
					const fileName = options.location.split('/').pop()
					const file = {
						originalname: fileName,
						buffer: Buffer.from(result),
					}
					result = file
					break
				}
				case AwsS3Format.JSON:
					try {
						result = JSON.parse(result.toString())
					} catch (err) {
						const e = err as Error
						this.logger.error(`[${domain}] ${e.message}`, {
							location: options.location,
							bucket: this.getBucket(options.bucket),
							format: options.format,
						})
						return
					}
					break
			}
		}

		return result
	}

	/**
	 * Return the signed url from S3 for a private file
	 *
	 * @param {
	 * 		{String} location where in the bucket to store the file
	 * 		{AwsS3Bucket} bucket the bucket to access
	 * 		{expiresIn} the time in seconds the url is valid
	 * } options
	 */

	async getSignedFileUrl(options: { location: string; bucket: AwsS3Bucket; expiresIn: number }): Promise<string> {
		const domain = 'app::aws::s3::AwsSecretsService::getSignedFileUrl'

		this.logger.debug(`[${domain}][${this.getBucket(options.bucket)}][${options.location}] Get signed URL`)

		const command = new GetObjectCommand({
			Bucket: this.getBucket(options.bucket),
			Key: options.location,
		})

		const url = await getSignedUrl(this.s3Client, command, { expiresIn: options.expiresIn ?? 3600 })
		this.logger.debug(`[${domain}][${this.getBucket(options.bucket)}][${options.location}]`, url)
		return url
	}

	/**
	 * Return the signed url from S3 for a private object url
	 *
	 * @param {
	 * 		{url} url of the file in s3
	 * 		{expiresIn} the time in seconds the url is valid
	 * } options
	 */

	async getSignedUrl(options: { url: string; expiresIn: number }): Promise<string> {
		const domain = 'app::aws::s3::AwsSecretsService::getSignedUrl'

		this.logger.debug(`[${domain}] Get signed URL for ${options.url}`)

		const s3ObjectUrl = parseUrl(options.url)
		const presigner = new S3RequestPresigner({
			credentials: this.s3Client.config.credentials,
			region: this.s3Client.config.region,
			sha256: Hash.bind(null, 'sha256'),
		})

		// Create a GET request from S3 url.
		const result = await presigner.presign(new HttpRequest(s3ObjectUrl))
		this.logger.debug(`[${domain}] Result: ${formatUrl(result)}`)
		return formatUrl(result)
	}

	/**
	 * Deletes the content to S3
	 *
	 * @param {
	 * 		{String} location where in the bucket to store the file
	 * 		{AwsS3Bucket} bucket the bucket to access
	 * } options
	 */

	async remove(options: { location: string; bucket: AwsS3Bucket }): Promise<any> {
		const domain = 'app::aws::s3::AwsSecretsService::remove'

		this.logger.debug(`[${domain}][${this.getBucket(options.bucket)}] ${options.location}`)

		const command = new DeleteObjectCommand({
			Bucket: this.getBucket(options.bucket),
			Key: options.location,
		})

		return await this.s3Client.send(command)
	}

	private getBucket(bucket: AwsS3Bucket): string {
		let bucketName
		if (bucket === AwsS3BucketType.PUBLIC) {
			bucketName = this.s3Config.AWS_S3_JL_PUBLIC_BUCKET
		} else if (bucket === AwsS3BucketType.PRIVATE) {
			bucketName = this.s3Config.AWS_S3_JL_PRIVATE_BUCKET
		}
		if (!bucketName) {
			throw new Error(`Bucket ${bucket} not found`)
		}
		return bucketName
	}
}
