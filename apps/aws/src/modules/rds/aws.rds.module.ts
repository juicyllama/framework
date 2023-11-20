import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Api, Enviroment, Logger, Markdown } from '@juicyllama/utils'
import Joi from 'joi'
import { AwsRdsService } from './aws.rds.service'
import { awsConfigJoi } from '../aws.config.joi'
import awsConfig from '../aws.nest.config'
import { awsRdsConfigJoi } from './config/aws.rds.config.joi'
import awsRdsConfig from './config/aws.rds.config'
import { systemConfigJoi, systemConfig } from '@juicyllama/core'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [awsConfig, awsRdsConfig, systemConfig],
			validationSchema:
				process.env.NODE_ENV !== Enviroment.test
					? Joi.object({ ...awsConfigJoi, ...awsRdsConfigJoi, ...systemConfigJoi })
					: null,
		}),
	],
	controllers: [],
	providers: [AwsRdsService, Api, Logger, Markdown],
	exports: [AwsRdsService],
})
export class AwsRdsModule {}
