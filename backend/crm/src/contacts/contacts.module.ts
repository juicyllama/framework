import { Logger } from '@juicyllama/utils'
import { forwardRef, Module } from '@nestjs/common'
import { CacheModule } from '@nestjs/cache-manager'
import { ContactsService } from './contacts.service'
import { ContactsController } from './contacts.controller'
import { ConfigModule } from '@nestjs/config'
import {
	AccountModule,
	AuthModule,
	BeaconModule,
	cacheConfig,
	databaseConfig,
	jwtConfig,
	Query,
	StorageModule,
	TagsModule,
	UsersModule,
} from '@juicyllama/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { Contact } from './contacts.entity'
import { ContactAddress } from './address/address.entity'
import { ContactEmail } from './email/email.entity'
import { ContactPhone } from './phone/phone.entity'
import { ContactSocial } from './social/social.entity'
import { ContactSocialService } from './social/social.service'
import { ContactPhoneService } from './phone/phone.service'
import { ContactEmailService } from './email/email.service'
import { ContactAddressService } from './address/address.service'

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [cacheConfig],
			isGlobal: true,
			envFilePath: '.env',
		}),
		CacheModule.registerAsync(cacheConfig()),
		TypeOrmModule.forRoot(databaseConfig()),
		TypeOrmModule.forFeature([Contact, ContactAddress, ContactEmail, ContactPhone, ContactSocial]),
		JwtModule.register(jwtConfig()),
		forwardRef(() => AuthModule),
		forwardRef(() => AccountModule),
		forwardRef(() => BeaconModule),
		forwardRef(() => StorageModule),
		forwardRef(() => TagsModule),
		forwardRef(() => UsersModule),
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
	exports: [ContactsService,
		ContactSocialService,
		ContactPhoneService,
		ContactEmailService,
		ContactAddressService],
})
export class ContactsModule {}
