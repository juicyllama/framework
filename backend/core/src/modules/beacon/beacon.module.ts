import { forwardRef, Module } from '@nestjs/common'
import { Env, Logger } from '@juicyllama/utils'
import { BeaconService } from './beacon.service.js'
import { BeaconEmailService } from './email/email.service.js'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BeaconEmail } from './email/email.entity.js'
import Joi from 'joi'
import beaconConfig from '../../configs/beacon.config.js'
import { beaconConfigJoi } from '../../configs/beacon.config.joi.js'
import { databaseConfig } from '../../configs/index.js'
import { BeaconPushService } from './push/push.service.js'
import { BeaconPush } from './push/push.entity.js'
import { Query } from '../../utils/typeorm/Query.js'
import { BeaconSmsService } from './sms/sms.service.js'
import { BeaconSms } from './sms/sms.entity.js'
import { BeaconNotification } from './notification/notification.entity.js'
import { BeaconNotificationService } from './notification/notification.service.js'
import { UsersModule } from '../users/users.module.js'
import { AuthModule } from '../auth/auth.module.js'
import { BeaconIm } from './im/im.entity.js'
import { BeaconImService } from './im/im.service.js'

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
