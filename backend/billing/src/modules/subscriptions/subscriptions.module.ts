import { AuthModule, FxModule, Query, SettingsModule } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ChargesModule } from '../charges/charges.module'
import { SubscriptionsController } from './subscriptions.controller'
import { SubscriptionsCronController } from './subscriptions.cron.controller'
import { SubscriptionsCronService } from './subscriptions.crons.service'
import { Subscription } from './subscriptions.entity'
import { SubscriptionsService } from './subscriptions.service'

@Module({
	imports: [TypeOrmModule.forFeature([Subscription]), AuthModule, ChargesModule, SettingsModule, FxModule],
	controllers: [SubscriptionsController, SubscriptionsCronController],
	providers: [SubscriptionsService, SubscriptionsCronService, Logger, Query],
	exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
