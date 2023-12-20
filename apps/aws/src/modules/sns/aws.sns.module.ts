import { SNSClient } from '@aws-sdk/client-sns'
import { ConfigValidationModule, getConfigToken } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { AwsConfigDto } from '../aws.config.dto'
import { AwsSnsClientToken } from './aws.sns.constants'
import { AwsSnsService } from './aws.sns.service'
import { AwsSnsConfigDto } from './config/aws.sns.config.dto'

@Module({
	imports: [ConfigValidationModule.register(AwsSnsConfigDto), ConfigValidationModule.register(AwsConfigDto)],
	controllers: [],
	providers: [
		AwsSnsService,
		Logger,
		{
			provide: AwsSnsClientToken,
			inject: [getConfigToken(AwsConfigDto)],
			useFactory: (config: AwsConfigDto) => {
				return new SNSClient({
					region: config.AWS_JL_REGION,
					credentials: {
						accessKeyId: config.AWS_JL_ACCESS_KEY_ID,
						secretAccessKey: config.AWS_JL_SECRET_KEY_ID,
					},
				})
			},
		},
	],
	exports: [AwsSnsService],
})
export class AwsSnsModule {}
