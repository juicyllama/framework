import { BeaconModule, cacheConfig, databaseConfig, jwtConfig, Query, SettingsModule } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Contact } from './contacts.entity'
import { ContactsModule } from './contacts.module'
import { CrmCronsContactsService } from './crm.crons.contacts.service'
import { CRMCronsController } from './crm.cron.controller'
import { ContactPhone } from './phone/phone.entity'
import { ContactPhoneService } from './phone/phone.service'

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
		BeaconModule,
		ContactsModule,
		SettingsModule,
	],
	controllers: [CRMCronsController],
	providers: [Logger, Query, CrmCronsContactsService, ContactPhoneService],
	exports: [CrmCronsContactsService],
})
export class CrmCronsModule {}
