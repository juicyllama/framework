import { SESv2Client } from '@aws-sdk/client-sesv2'
import { ConfigValidationModule, getConfigToken } from '@juicyllama/core'
import { Logger, Markdown } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AwsConfigDto } from '../aws.config.dto'
import { AwsSesClientToken } from './aws.ses.constants'
import { AwsSesService } from './aws.ses.service'
import { AwsSesConfigDto } from './config/aws.ses.config.dto'

@Module({
	imports: [
		ConfigModule,
		ConfigValidationModule.register(AwsConfigDto), 
		ConfigValidationModule.register(AwsSesConfigDto)
	],
	controllers: [],
	providers: [
		AwsSesService,
		Logger,
		Markdown,
		{
			provide: AwsSesClientToken,
			inject: [getConfigToken(AwsSesConfigDto), getConfigToken(AwsConfigDto)],
			useFactory: (sesConfig: AwsSesConfigDto, awsConfig: AwsConfigDto) => {
				return new SESv2Client({
					region: sesConfig.AWS_SES_JL_REGION ?? awsConfig.AWS_JL_REGION,
					credentials: {
						accessKeyId: awsConfig.AWS_JL_ACCESS_KEY_ID,
						secretAccessKey: awsConfig.AWS_JL_SECRET_KEY_ID,
					},
				})
			},
		},
	],
	exports: [AwsSesService],
})
export class AwsSesModule {}
