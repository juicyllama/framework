import {
	DeleteObjectCommand,
	GetObjectCommand,
	ListObjectsCommand,
	S3Client,
	PutObjectCommandInput,
} from '@aws-sdk/client-s3'
import { Upload, Configuration } from '@aws-sdk/lib-storage'
import { InjectConfig } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Injectable } from '@nestjs/common'
import { getApplyMd5BodyChecksumPlugin } from '@smithy/middleware-apply-body-checksum'
import { InjectS3 } from './aws.s3.constants'
import { AwsS3Bucket, AwsS3BucketType, AwsS3Format } from './aws.s3.enums'
import { AwsS3ConfigDto } from './config/aws.s3.config.dto'

const streamToString = stream =>
	new Promise((resolve, reject) => {
		const chunks = []
		stream.on('data', chunk => chunks.push(chunk))
		stream.on('error', reject)
		stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
	})

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
			//bug fix for aws s3 checksum on large files: https://github.com/aws/aws-sdk-js-v3/issues/4321
			this.s3Client.middlewareStack.use(getApplyMd5BodyChecksumPlugin(this.s3Client.config))

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
		} catch (e) {
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

	async findOne(options: { location: string; bucket: AwsS3Bucket; format: AwsS3Format }): Promise<any> {
		const domain = 'app::aws::s3::AwsSecretsService::findOne'

		this.logger.debug(`[${domain}][${this.getBucket(options.bucket)}] ${options.location}`)

		const command = new GetObjectCommand({
			Bucket: this.getBucket(options.bucket),
			Key: options.location,
		})

		let result

		try {
			const data = await this.s3Client.send(command)
			result = await streamToString(data.Body)
		} catch (e) {
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

		this.logger.debug(`[${domain}] File found`)

		if (options.format) {
			switch (options.format) {
				case AwsS3Format.JSON:
					try {
						result = JSON.parse(result.toString())
					} catch (e) {
						this.logger.error(`[${domain}] ${e.message}`, {
							location: options.location,
							bucket: this.getBucket(options.bucket),
							format: options.format,
						})
						return false
					}
			}
		}

		return result
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
		if (bucket === AwsS3BucketType.PUBLIC) {
			return this.s3Config.AWS_S3_JL_PUBLIC_BUCKET
		} else if (bucket === AwsS3BucketType.PRIVATE) {
			return this.s3Config.AWS_S3_JL_PRIVATE_BUCKET
		} else {
			return bucket
		}
	}
}
