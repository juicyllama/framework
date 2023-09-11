import { forwardRef, Module } from '@nestjs/common'
import { Env, Logger } from '@juicyllama/utils'
import { BeaconService } from './beacon.service'
import { BeaconEmailService } from './email/email.service'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BeaconEmail } from './email/email.entity'
import Joi from 'joi'
import beaconConfig from '../../configs/beacon.config'
import { beaconConfigJoi } from '../../configs/beacon.config.joi'
import { databaseConfig } from '../../configs'
import { BeaconPushService } from './push/push.service'
import { BeaconPush } from './push/push.entity'
import { Query } from '../../utils/typeorm/Query'
import { BeaconSmsService } from './sms/sms.service'
import { BeaconSms } from './sms/sms.entity'
import { BeaconNotification } from './notification/notification.entity'
import { BeaconNotificationService } from './notification/notification.service'
import { UsersModule } from '../users/users.module'
import { AuthModule } from '../auth/auth.module'
import { BeaconIm } from './im/im.entity'
import { BeaconImService } from './im/im.service'

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [beaconConfig],
			isGlobal: true,
			validationSchema: Env.IsNotTest() ? Joi.object(beaconConfigJoi) : null,
		}),
		TypeOrmModule.forRoot(databaseConfig()),
		TypeOrmModule.forFeature([BeaconEmail, BeaconSms, BeaconPush, BeaconIm, BeaconNotification]),
		forwardRef(() => AuthModule),
		forwardRef(() => UsersModule),
	],
	controllers: [],
	providers: [
		BeaconService,
		BeaconEmailService,
		BeaconSmsService,
		BeaconPushService,
		BeaconImService,
		BeaconNotificationService,
		Logger,
		Query,
	],
	exports: [BeaconService],
})
export class BeaconModule {}
