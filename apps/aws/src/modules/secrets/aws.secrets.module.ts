import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager'
import { ConfigValidationModule, getConfigToken } from '@juicyllama/core'
import { Env, Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { AwsConfigDto } from '../aws.config.dto'
import { AwsSecretsManagerToken } from './aws.secrets.constants'
import { AwsSecretsService } from './aws.secrets.service'

@Module({
	imports: [ConfigValidationModule.register(AwsConfigDto)],
	controllers: [],
	providers: [
		AwsSecretsService,
		Logger,
		{
			provide: AwsSecretsManagerToken,
			inject: [getConfigToken(AwsConfigDto)],
			useFactory: (config: AwsConfigDto) => {
				return new SecretsManagerClient({
					region: config.AWS_JL_REGION,
					credentials: Env.IsProd
						? undefined
						: {
								accessKeyId: config.AWS_JL_ACCESS_KEY_ID,
								secretAccessKey: config.AWS_JL_SECRET_KEY_ID,
							},
				})
			},
		},
	],
	exports: [AwsSecretsService],
})
export class AwsSecretsModule {}
