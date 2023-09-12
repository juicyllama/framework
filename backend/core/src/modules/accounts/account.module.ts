import { forwardRef, MiddlewareConsumer, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { MiddlewareAccountId } from '../../middleware'
import { BeaconModule } from '../beacon/beacon.module'
import { SettingsModule } from '../settings/settings.module'
import { TagsModule } from '../tags/tags.module'
import { Account } from './account.entity'
import { AuthModule } from '../auth/auth.module'
import { UsersModule } from '../users/users.module'
import { AccountService } from './account.service'
import { databaseConfig, jwtConfig } from '../../configs'
import { Logger } from '@juicyllama/utils'
import { Query } from '../../utils/typeorm/Query'
import { AccountController } from './account.controller'
import { StorageModule } from '../storage/storage.module'
import { AccountHooks } from './account.hooks'

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
	providers: [AccountService, AccountHooks, Logger, Query],
	exports: [AccountService],
})
export class AccountModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(MiddlewareAccountId)
	}
}
