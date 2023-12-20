import { RDSClient } from '@aws-sdk/client-rds'
import { ConfigValidationModule, getConfigToken } from '@juicyllama/core'
import { Api, Logger, Markdown } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { AwsConfigDto } from '../aws.config.dto'
import { RdsClient } from './aws.rds.constants'
import { AwsRdsService } from './aws.rds.service'
import { AwsRdsConfigDto } from './config/aws.rds.config.dto'

@Module({
	imports: [ConfigValidationModule.register(AwsRdsConfigDto), ConfigValidationModule.register(AwsConfigDto)],
	controllers: [],
	providers: [
		AwsRdsService,
		Api,
		Logger,
		Markdown,
		{
			provide: RdsClient,
			inject: [getConfigToken(AwsRdsConfigDto), getConfigToken(AwsConfigDto)],
			useFactory: (rdsConfig: AwsRdsConfigDto, awsConfig: AwsConfigDto) => {
				return new RDSClient({
					region: rdsConfig.AWS_RDS_JL_REGION ?? awsConfig.AWS_JL_REGION,
					credentials: {
						accessKeyId: awsConfig.AWS_JL_ACCESS_KEY_ID,
						secretAccessKey: awsConfig.AWS_JL_SECRET_KEY_ID,
					},
				})
			},
		},
	],
	exports: [AwsRdsService],
})
export class AwsRdsModule {}
