import { forwardRef, Module } from '@nestjs/common'
import { AccountModule } from './accounts/account.module'
import { UsersModule } from './users/users.module'
import {
	AuthModule,
	BeaconModule,
	ConfigValidationModule,
	FxModule,
	SettingsModule,
	StorageModule,
	TagsModule,
} from '..'

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
