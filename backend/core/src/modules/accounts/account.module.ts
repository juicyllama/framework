import { forwardRef, MiddlewareConsumer, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { MiddlewareAccountId } from '../../middleware/index.js'
import { BeaconModule } from '../beacon/beacon.module.js'
import { SettingsModule } from '../settings/settings.module.js'
import { TagsModule } from '../tags/tags.module.js'
import { Account } from './account.entity.js'
import { AuthModule } from '../auth/auth.module.js'
import { UsersModule } from '../users/users.module.js'
import { AccountService } from './account.service.js'
import { databaseConfig, jwtConfig } from '../../configs/index.js'
import { Logger } from '@juicyllama/utils'
import { Query } from '../../utils/typeorm/Query.js'
import { AccountController } from './account.controller.js'
import { StorageModule } from '../storage/storage.module.js'
import { AccountHooks } from './account.hooks.js'
import { AccountInstallationService } from './account.installation.js'

@Module({
	imports: [
		JwtModule.register(jwtConfig()),
		TypeOrmModule.forRoot(databaseConfig()),
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
