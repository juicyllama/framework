import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Api, Enviroment, Logger } from '@juicyllama/utils'
import Joi from 'joi'
import { awsConfigJoi } from '../aws.config.joi'
import awsConfig from '../aws.nest.config'
import { awsSnsConfigJoi } from './config/aws.sns.config.joi'
import awsSnsConfig from './config/aws.sns.nest.config'
import { AwsSnsService } from './aws.sns.service'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [awsConfig, awsSnsConfig],
			validationSchema:
				process.env.NODE_ENV !== Enviroment.test ? Joi.object({ ...awsConfigJoi, ...awsSnsConfigJoi }) : null,
		}),
	],
	controllers: [],
	providers: [AwsSnsService, Api, Logger],
	exports: [AwsSnsService],
})
export class AwsSnsModule {}
