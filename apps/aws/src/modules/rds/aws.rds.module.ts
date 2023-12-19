import { RDSClient } from '@aws-sdk/client-rds'
import { systemConfigJoi, systemConfig, ConfigValidationModule, getConfigToken } from '@juicyllama/core'
import { Api, Enviroment, Logger, Markdown } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import Joi from 'joi'
import { awsConfigJoi } from '../aws.config.joi'
import awsConfig from '../aws.nest.config'
import { RdsClient } from './aws.rds.constants'
import { AwsRdsService } from './aws.rds.service'
import { AWsRdsConfigDto } from './config/aws.rds.config.dto'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [awsConfig, systemConfig],
			validationSchema:
				process.env.NODE_ENV !== Enviroment.test ? Joi.object({ ...awsConfigJoi, ...systemConfigJoi }) : null,
		}),
		ConfigValidationModule.register(AWsRdsConfigDto),
	],
	controllers: [],
	providers: [
		AwsRdsService,
		Api,
		Logger,
		Markdown,
		{
			provide: RdsClient,
			inject: [getConfigToken(AWsRdsConfigDto), ConfigService],
			useFactory: (rdsConfig: AWsRdsConfigDto, config: ConfigService) => {
				return new RDSClient({
					region: rdsConfig.AWS_RDS_JL_REGION ?? config.get<string>('aws.AWS_JL_REGION'),
					credentials: {
						accessKeyId: config.get<string>('aws.AWS_JL_ACCESS_KEY_ID'),
						secretAccessKey: config.get<string>('aws.AWS_JL_SECRET_KEY_ID'),
					},
				})
			},
		},
	],
	exports: [AwsRdsService],
})
export class AwsRdsModule {}
