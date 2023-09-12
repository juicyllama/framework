import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { Logger } from '@juicyllama/utils'
import { Subscription } from './subscriptions.entity'
import { SubscriptionsController } from './subscriptions.controller'
import { SubscriptionsService } from './subscriptions.service'
import { AccountModule, AuthModule, databaseConfig, jwtConfig, Query } from '@juicyllama/core'

@Module({
	imports: [
		JwtModule.register(jwtConfig()),
		TypeOrmModule.forRoot(databaseConfig()),
		TypeOrmModule.forFeature([Subscription]),
		forwardRef(() => AuthModule),
		forwardRef(() => AccountModule),
	],
	controllers: [SubscriptionsController],
	providers: [SubscriptionsService, Logger, Query],
	exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
