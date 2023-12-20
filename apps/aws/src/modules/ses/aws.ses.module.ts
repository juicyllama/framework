import { SESv2Client } from '@aws-sdk/client-sesv2'
import { ConfigValidationModule, getConfigToken } from '@juicyllama/core'
import { Logger, Markdown } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AwsSesClientToken } from './aws.ses.constants'
import { AwsSesService } from './aws.ses.service'
import { AwsSesConfigDto } from './config/aws.ses.config.dto'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		ConfigValidationModule.register(AwsSesConfigDto),
	],
	controllers: [],
	providers: [
		AwsSesService,
		Logger,
		Markdown,
		{
			provide: AwsSesClientToken,
			inject: [getConfigToken(AwsSesConfigDto), ConfigService],
			useFactory: (sesConfig: AwsSesConfigDto, config: ConfigService) => {
				return new SESv2Client({
					region: sesConfig.AWS_SES_JL_REGION ?? config.get('AWS_JL_REGION'),
					credentials: {
						accessKeyId: config.get('AWS_JL_ACCESS_KEY_ID'),
						secretAccessKey: config.get('AWS_JL_SECRET_KEY_ID'),
					},
				})
			},
		},
	],
	exports: [AwsSesService],
})
export class AwsSesModule {}
