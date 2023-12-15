import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Logger } from '@juicyllama/utils'
import { Subscription } from './subscriptions.entity'
import { SubscriptionsController } from './subscriptions.controller'
import { SubscriptionsService } from './subscriptions.service'
import { AccountModule, AuthModule, Query, SettingsModule } from '@juicyllama/core'
import { SubscriptionsCronController } from './subscriptions.cron.controller'
import { SubscriptionsCronService } from './subscriptions.crons.service'
import { ChargesModule } from '../charges/charges.module'

@Module({
	imports: [TypeOrmModule.forFeature([Subscription]), forwardRef(() => AuthModule), forwardRef(() => AccountModule), forwardRef(() => ChargesModule), forwardRef(() => SettingsModule)],
	controllers: [SubscriptionsController, SubscriptionsCronController],
	providers: [SubscriptionsService, SubscriptionsCronService, Logger, Query],
	exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
