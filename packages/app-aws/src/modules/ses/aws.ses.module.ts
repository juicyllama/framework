import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Api, Enviroment, Logger, Markdown } from '@juicyllama/utils'
import Joi from 'joi'
import { AwsSesService } from './aws.ses.service'
import { awsConfigJoi } from '../aws.config.joi'
import awsConfig from '../aws.nest.config'
import { awsSesConfigJoi } from './config/aws.ses.config.joi'
import awsSesConfig from './config/aws.ses.nest.config'
import { systemConfigJoi, systemConfig } from '@juicyllama/core'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [awsConfig, awsSesConfig, systemConfig],
			validationSchema:
				process.env.NODE_ENV !== Enviroment.test
					? Joi.object({ ...awsConfigJoi, ...awsSesConfigJoi, ...systemConfigJoi })
					: null,
		}),
	],
	controllers: [],
	providers: [AwsSesService, Api, Logger, Markdown],
	exports: [AwsSesService],
})
export class AwsSesModule {}
