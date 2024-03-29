import { Logger } from '@juicyllama/utils'
import { forwardRef, MiddlewareConsumer, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MiddlewareAccountId } from '../../middleware'
import { Query } from '../../utils/typeorm/Query'
import { AuthModule } from '../auth/auth.module'
import { BeaconModule } from '../beacon/beacon.module'
import { SettingsModule } from '../settings/settings.module'
import { StorageModule } from '../storage/storage.module'
import { TagsModule } from '../tags/tags.module'
import { UsersModule } from '../users/users.module'
import { AccountController } from './account.controller'
import { Account } from './account.entity'
import { AccountHooks } from './account.hooks'
import { AccountInstallationService } from './account.installation'
import { AccountService } from './account.service'

@Module({
	imports: [
		TypeOrmModule.forFeature([Account]),
		forwardRef(() => AuthModule),
		forwardRef(() => BeaconModule),
		forwardRef(() => SettingsModule),
		forwardRef(() => StorageModule),
		forwardRef(() => TagsModule),
		forwardRef(() => UsersModule),
	],
	controllers: [AccountController],
	providers: [AccountService, AccountInstallationService, AccountHooks, Logger, Query],
	exports: [AccountService],
})
export class AccountModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(MiddlewareAccountId)
	}
}
