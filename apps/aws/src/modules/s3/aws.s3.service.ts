import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { DeleteObjectCommand, GetObjectCommand, ListObjectsCommand, S3Client, PutObjectCommandInput } from '@aws-sdk/client-s3'
import { Upload, Configuration } from '@aws-sdk/lib-storage'
import { getApplyMd5BodyChecksumPlugin } from '@smithy/middleware-apply-body-checksum'
import { awsS3Config } from './config/aws.s3.config'
import { Logger } from '@juicyllama/utils'
import { AwsS3Bucket, AwsS3BucketType, AwsS3Format } from './aws.s3.enums'

const streamToString = stream =>
	new Promise((resolve, reject) => {
		const chunks = []
		stream.on('data', chunk => chunks.push(chunk))
		stream.on('error', reject)
		stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
	})

@Injectable()
export class AwsS3Service {
	constructor(@Inject(forwardRef(() => Logger)) private readonly logger: Logger) {}

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
		location: string,
		bucket: AwsS3Bucket,
		format?: AwsS3Format,
		file: any,
		params?: PutObjectCommandInput,
		sizing?: Configuration
	}
	): Promise<any> {
		const domain = 'app::aws::s3::AwsSecretsService::create'

		this.logger.debug(`[${domain}][${this.getBucket(options.bucket)}] create: ${options.location}`)

		if(options.format){
			switch (options.format) {
				case AwsS3Format.JSON:
					options.file = Buffer.from(JSON.stringify(options.file))
					break
			}
		}

		try {
			const client = new S3Client(awsS3Config().client)
			//bug fix for aws s3 checksum on large files: https://github.com/aws/aws-sdk-js-v3/issues/4321
			client.middlewareStack.use(getApplyMd5BodyChecksumPlugin(client.config))

			const params = {
				Bucket: this.getBucket(options.bucket),
				Key: options.location,
				Body: options.file,
				...options.params
			}

			if(!options.sizing){
				options.sizing = <Configuration>{
				queueSize: 4,
				partSize: 1024 * 1024 * 5, 
				leavePartsOnError: false,
				}
			}

			const upload = new Upload({
				client,
				params,
				...options.sizing
			})

			upload.on("httpUploadProgress", (progress) => {
				this.logger.debug(`[${domain}][${this.getBucket(options.bucket)}] Progress: `, progress)	
			  });

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

	async findAll(options: {location: string, bucket: AwsS3Bucket}): Promise<any> {
		const domain = 'app::aws::s3::AwsSecretsService::findAll'

		this.logger.debug(`[${domain}][${this.getBucket(options.bucket)}] ${options.location}`)

		const client = new S3Client(awsS3Config().client)
		const command = new ListObjectsCommand({
			Bucket: this.getBucket(options.bucket),
			Prefix: options.location,
		})
		const data = await client.send(command)

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

	async findOne(options: { location: string, bucket: AwsS3Bucket, format: AwsS3Format}): Promise<any> {
		const domain = 'app::aws::s3::AwsSecretsService::findOne'

		this.logger.debug(`[${domain}][${this.getBucket(options.bucket)}] ${options.location}`)

		const client = new S3Client(awsS3Config().client)

		const command = new GetObjectCommand({
			Bucket: this.getBucket(options.bucket),
			Key: options.location,
		})

		let result

		try {
			const data = await client.send(command)
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

		if(options.format){
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

	async remove(options: {location: string, bucket: AwsS3Bucket}): Promise<any> {
		const domain = 'app::aws::s3::AwsSecretsService::remove'

		this.logger.debug(`[${domain}][${this.getBucket(options.bucket)}] ${options.location}`)

		const client = new S3Client(awsS3Config().client)
		const command = new DeleteObjectCommand({
			Bucket: this.getBucket(options.bucket),
			Key: options.location,
		})

		return await client.send(command)
	}

	private getBucket(bucket: AwsS3Bucket): string {
		if (bucket === AwsS3BucketType.PUBLIC) {
			return awsS3Config().s3buckets[AwsS3BucketType.PUBLIC]
		}else if (bucket === AwsS3BucketType.PRIVATE) {
			return awsS3Config().s3buckets[AwsS3BucketType.PRIVATE]
		}else{
			return bucket
		}
	}
}
