import { ConfigValidationModule, databaseConfig, getConfigToken, Query } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MailchimpConfigDto } from '../configs/mailchimp.config.dto'
import { MailchimpScaffold } from '../configs/mailchimp.scaffold'
import { MailchimpClientToken } from './mailchimp.constants'
import { MailchimpContact } from './mailchimp.entity'
import { MailchimpService } from './mailchimp.service'

@Module({
	imports: [
		ConfigValidationModule.register(MailchimpConfigDto),
		TypeOrmModule.forRoot(databaseConfig()),
		TypeOrmModule.forFeature([MailchimpContact]),
	],
	controllers: [],
	providers: [
		MailchimpService,
		Logger,
		Query,
		{
			provide: MailchimpClientToken,
			inject: [getConfigToken(MailchimpConfigDto)],
			useFactory: (config: MailchimpConfigDto) =>
				MailchimpScaffold(config.MAILCHIMP_API_KEY, config.MAILCHIMP_SERVER_PREFIX),
		},
	],
	exports: [MailchimpService],
})
export class MailchimpModule {}
