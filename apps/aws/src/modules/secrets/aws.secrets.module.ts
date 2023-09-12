import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Api, Enviroment, Logger } from '@juicyllama/utils'
import Joi from 'joi'
import { AwsSecretsService } from './aws.secrets.service'
import { awsConfigJoi } from '../aws.config.joi'
import awsConfig from '../aws.nest.config'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [awsConfig],
			validationSchema: process.env.NODE_ENV !== Enviroment.test ? Joi.object({ ...awsConfigJoi }) : null,
		}),
	],
	controllers: [],
	providers: [AwsSecretsService, Api, Logger],
	exports: [AwsSecretsService],
})
export class AwsSecretsModule {}
