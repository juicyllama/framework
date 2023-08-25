import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Api, Enviroment, Logger } from '@juicyllama/utils'
import Joi from 'joi'
import { AwsS3Service } from './aws.s3.service'
import { awsConfigJoi } from '../aws.config.joi'
import awsConfig from '../aws.nest.config'
import { awsS3ConfigJoi } from './config/aws.s3.config.joi'
import awsS3Config from './config/aws.s3.nest.config'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [awsConfig, awsS3Config],
			validationSchema:
				process.env.NODE_ENV !== Enviroment.test ? Joi.object({ ...awsConfigJoi, ...awsS3ConfigJoi }) : null,
		}),
	],
	controllers: [],
	providers: [AwsS3Service, Api, Logger],
	exports: [AwsS3Service],
})
export class AwsS3Module {}
