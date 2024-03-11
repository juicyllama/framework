import {
	AccountModule,
	AuthModule,
	BeaconModule,
	jwtConfig,
	Query,
	StorageModule,
	TagsModule,
	UsersModule,
} from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ContactAddress } from './address/address.entity'
import { ContactAddressService } from './address/address.service'
import { ContactsController } from './contacts.controller'
import { Contact } from './contacts.entity'
import { ContactsService } from './contacts.service'
import { ContactEmail } from './email/email.entity'
import { ContactEmailService } from './email/email.service'
import { ContactPhone } from './phone/phone.entity'
import { ContactPhoneService } from './phone/phone.service'
import { ContactSocial } from './social/social.entity'
import { ContactSocialService } from './social/social.service'

@Module({
	imports: [
		TypeOrmModule.forFeature([Contact, ContactAddress, ContactEmail, ContactPhone, ContactSocial]),
		JwtModule.register(jwtConfig()),
		AuthModule,
		AccountModule,
		BeaconModule,
		StorageModule,
		TagsModule,
		UsersModule,
	],
	controllers: [ContactsController],
	providers: [
		ContactsService,
		Logger,
		Query,
		ContactSocialService,
		ContactPhoneService,
		ContactEmailService,
		ContactAddressService,
	],
	exports: [ContactsService, ContactSocialService, ContactPhoneService, ContactEmailService, ContactAddressService],
})
export class ContactsModule {}
