import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager'
import { Env, Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AwsSecretsManagerToken } from './aws.secrets.constants'
import { AwsSecretsService } from './aws.secrets.service'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
	],
	controllers: [],
	providers: [
		AwsSecretsService,
		Logger,
		{
			provide: AwsSecretsManagerToken,
			inject: [ConfigService],
			useFactory: (config: ConfigService) => {
				return new SecretsManagerClient({
					region: config.get('AWS_S3_JL_REGION'),
					credentials: Env.IsProd
						? undefined
						: {
								accessKeyId: config.get('AWS_JL_ACCESS_KEY_ID'),
								secretAccessKey: config.get('AWS_JL_SECRET_KEY_ID'),
							},
				})
			},
		},
	],
	exports: [AwsSecretsService],
})
export class AwsSecretsModule {}
