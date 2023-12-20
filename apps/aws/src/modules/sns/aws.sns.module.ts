import { SNSClient } from '@aws-sdk/client-sns'
import { ConfigValidationModule } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AwsSnsClientToken } from './aws.sns.constants'
import { AwsSnsService } from './aws.sns.service'
import { AwsSnsConfigDto } from './config/aws.sns.config.dto'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		ConfigValidationModule.register(AwsSnsConfigDto),
	],
	controllers: [],
	providers: [
		AwsSnsService,
		Logger,
		{
			provide: AwsSnsClientToken,
			inject: [ConfigService],
			useFactory: (config: ConfigService) => {
				return new SNSClient({
					region: config.get('AWS_JL_REGION'),
					credentials: {
						accessKeyId: config.get('AWS_JL_ACCESS_KEY_ID'),
						secretAccessKey: config.get('AWS_JL_SECRET_KEY_ID'),
					},
				})
			},
		},
	],
	exports: [AwsSnsService],
})
export class AwsSnsModule {}
