import { BeaconModule, databaseConfig, jwtConfig, Query, SettingsModule } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Contact } from './contacts.entity'
import { ContactsModule } from './contacts.module'
import { CRMCronsController } from './crm.cron.controller'
import { CrmCronsContactsService } from './crm.crons.contacts.service'
import { ContactPhone } from './phone/phone.entity'
import { ContactPhoneService } from './phone/phone.service'

@Module({
	imports: [
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
