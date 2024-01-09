import { Logger } from '@juicyllama/utils'
import { forwardRef, Module } from '@nestjs/common'
import { CacheModule } from '@nestjs/cache-manager'
import { ConfigModule } from '@nestjs/config'
import { BeaconModule, cacheConfig, databaseConfig, jwtConfig, Query, SettingsModule } from '@juicyllama/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { CrmCronsContactsService } from './crm.crons.contacts.service'
import { CRMCronsController } from './crm.cron.controller'
import { ContactsModule } from './contacts.module'
import { ContactPhoneService } from './phone/phone.service'
import { Contact } from './contacts.entity'
import { ContactPhone } from './phone/phone.entity'

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [cacheConfig],
			isGlobal: true,
			envFilePath: '.env',
		}),
		CacheModule.registerAsync(cacheConfig()),
		TypeOrmModule.forRoot(databaseConfig()),
		TypeOrmModule.forFeature([Contact, ContactPhone]),
		JwtModule.register(jwtConfig()),
		forwardRef(() => BeaconModule),
		forwardRef(() => ContactsModule),
		forwardRef(() => SettingsModule),
	],
	controllers: [CRMCronsController],
	providers: [Logger, Query, CrmCronsContactsService, ContactPhoneService],
	exports: [CrmCronsContactsService],
})
export class CrmCronsModule {}
