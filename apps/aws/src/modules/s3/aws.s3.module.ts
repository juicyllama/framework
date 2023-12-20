import { S3Client as AWSS3Client } from '@aws-sdk/client-s3'
import { ConfigValidationModule, getConfigToken } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { AwsConfigDto } from '../aws.config.dto'
import { S3Client } from './aws.s3.constants'
import { AwsS3Service } from './aws.s3.service'
import { AwsS3ConfigDto } from './config/aws.s3.config.dto'

@Module({
	imports: [ConfigValidationModule.register(AwsS3ConfigDto), ConfigValidationModule.register(AwsConfigDto)],
	controllers: [],
	providers: [
		AwsS3Service,
		Logger,
		{
			provide: S3Client,
			inject: [getConfigToken(AwsS3ConfigDto), getConfigToken(AwsConfigDto)],
			useFactory: (s3Config: AwsS3ConfigDto, awsConfig: AwsConfigDto) => {
				return new AWSS3Client({
					region: s3Config.AWS_S3_JL_REGION,
					credentials: {
						accessKeyId: awsConfig.AWS_JL_ACCESS_KEY_ID,
						secretAccessKey: awsConfig.AWS_JL_SECRET_KEY_ID,
					},
				})
			},
		},
	],
	exports: [AwsS3Service],
})
export class AwsS3Module {}
