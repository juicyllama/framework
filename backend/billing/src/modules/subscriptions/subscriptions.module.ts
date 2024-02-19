import { AuthModule, FxModule, Query, SettingsModule } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SubscriptionsController } from './subscriptions.controller'
import { SubscriptionsCronController } from './subscriptions.cron.controller'
import { SubscriptionsCronService } from './subscriptions.crons.service'
import { Subscription } from './subscriptions.entity'
import { SubscriptionsService } from './subscriptions.service'
import { ChargesModule } from '../..'

@Module({
	imports: [
		TypeOrmModule.forFeature([Subscription]),
		forwardRef(() => ChargesModule),
		forwardRef(() => AuthModule),
		forwardRef(() => SettingsModule),
		forwardRef(() => FxModule),
	],
	controllers: [SubscriptionsController, SubscriptionsCronController],
	providers: [SubscriptionsService, SubscriptionsCronService, Logger, Query],
	exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
