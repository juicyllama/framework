import { forwardRef, Module } from '@nestjs/common'
import { AccountModule } from './accounts/account.module.js'
import { UsersModule } from './users/users.module.js'
import {
	AuthModule,
	BeaconModule,
	FxModule,
	SettingsModule,
	StorageModule,
	TagsModule,
} from '../index.js'
import { ConfigValidationModule } from './config/config.module.js'

@Module({
	imports: [
		forwardRef(() => AccountModule),
		forwardRef(() => AuthModule),
		forwardRef(() => BeaconModule),
		forwardRef(() => ConfigValidationModule),
		forwardRef(() => FxModule),
		forwardRef(() => SettingsModule),
		forwardRef(() => StorageModule),
		forwardRef(() => TagsModule),
		forwardRef(() => UsersModule),
	],
	controllers: [],
	providers: [],
})
export class CoreModule {}
