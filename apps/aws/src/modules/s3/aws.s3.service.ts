import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { DeleteObjectCommand, GetObjectCommand, ListObjectsCommand, S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { awsS3Config } from './config/aws.s3.config'
import { Logger } from '@juicyllama/utils'
import { AwsS3Bucket, AwsS3Format } from './aws.s3.enums'

const streamToString = (stream) =>
	new Promise((resolve, reject) => {
		const chunks = []
		stream.on('data', (chunk) => chunks.push(chunk))
		stream.on('error', reject)
		stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
	})

@Injectable()
export class AwsS3Service {
	constructor(@Inject(forwardRef(() => Logger)) private readonly logger: Logger) {}

	/**
	 * Writes the content to S3
	 *
	 * @param {String} location where in the bucket to store the file
	 * @param {AwsS3Bucket} bucket the bucket to access
	 * @param {AwsS3Format} format the file format we are working with
	 * @param {any} file the file contents to create (blob, json etc)
	 */

	async create(
		location: string,
		bucket: AwsS3Bucket,
		format: AwsS3Format = AwsS3Format.JSON,
		file: any,
	): Promise<any> {
		const domain = 'app::aws::s3::AwsSecretsService::create'

		this.logger.debug(`[${domain}][${awsS3Config().s3buckets[bucket].bucket}] create: ${location}`)

		switch (format) {
			case AwsS3Format.JSON:
				file = Buffer.from(JSON.stringify(file))
				break
		}

		try {
			const client = new S3Client(awsS3Config().s3buckets[bucket].client)

			const params = {
				Bucket: awsS3Config().s3buckets[bucket].bucket,
				Key: location,
				Body: file,
			}

			const upload = new Upload({
				client,
				params,
			})

			return upload.done()
		} catch (e) {
			this.logger.warn(
				`[${domain}] Error: ${e.message}`,
				e.response
					? {
							status: e.response.status,
							data: e.response.data,
							location: location,
							bucket: bucket,
					  }
					: null,
			)
			return false
		}
	}

	/**
	 * List files in a s3 directory
	 *
	 * @param {String} location where in the bucket to store the file
	 * @param {AwsS3Bucket} bucket the bucket to access
	 */

	async findAll(location: string, bucket: AwsS3Bucket): Promise<any> {
		const domain = 'app::aws::s3::AwsSecretsService::findAll'

		this.logger.debug(`[${domain}][${awsS3Config().s3buckets[bucket].bucket}] ${location}`)

		const client = new S3Client(awsS3Config().s3buckets[bucket].client)
		const command = new ListObjectsCommand({
			Bucket: awsS3Config().s3buckets[bucket].bucket,
			Prefix: location,
		})
		const data = await client.send(command)

		const files = []

		if (data && data.Contents) {
			for (const file of data.Contents) {
				let fileName = file.Key
				fileName = fileName.replace(location, '')
				files.push(fileName)
			}
		}

		this.logger.debug(`[${domain}][${bucket}] ${files.length} files found`)
		return files
	}

	/**
	 * Return the content from S3
	 *
	 * @param {String} location where in the bucket to store the file
	 * @param {AwsS3Bucket} bucket the bucket to access
	 * @param {AwsS3Format} format the file format we are working with
	 * @param {string} [uuid] optional debugging pass through
	 */

	async findOne(location: string, bucket: AwsS3Bucket, format: AwsS3Format = AwsS3Format.JSON): Promise<any> {
		const domain = 'app::aws::s3::AwsSecretsService::findOne'

		this.logger.debug(`[${domain}][${awsS3Config().s3buckets[bucket].bucket}] ${location}`)

		const client = new S3Client(awsS3Config().s3buckets[bucket].client)

		const command = new GetObjectCommand({
			Bucket: awsS3Config().s3buckets[bucket].bucket,
			Key: location,
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
							location: location,
							bucket: bucket,
					  }
					: null,
			)
			return false
		}

		this.logger.debug(`[${domain}] File found`)

		switch (format) {
			case AwsS3Format.JSON:
				try {
					result = JSON.parse(result.toString())
				} catch (e) {
					this.logger.error(`[${domain}] ${e.message}`, {
						location: location,
						bucket: bucket,
						format: format,
					})
					return false
				}
		}

		return result
	}

	/**
	 * Deletes the content to S3
	 *
	 * @param {String} location where in the bucket to store the file
	 * @param {AwsS3Bucket} bucket the bucket to access
	 */

	async remove(location: string, bucket: AwsS3Bucket): Promise<any> {
		const domain = 'app::aws::s3::AwsSecretsService::remove'

		this.logger.debug(`[${domain}][${awsS3Config().s3buckets[bucket].bucket}] ${location}`)

		const client = new S3Client(awsS3Config().s3buckets[bucket].client)
		const command = new DeleteObjectCommand({
			Bucket: awsS3Config().s3buckets[bucket].bucket,
			Key: location,
		})

		return await client.send(command)
	}
}
