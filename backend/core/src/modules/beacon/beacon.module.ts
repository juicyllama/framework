import { Logger } from '@juicyllama/utils'
import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BeaconConfigDto } from '../../configs/beacon.config.dto'
import { Query } from '../../utils/typeorm/Query'
import { AuthModule } from '../auth/auth.module'
import { ConfigValidationModule } from '../config'
import { UsersModule } from '../users/users.module'
import { BeaconService } from './beacon.service'
import { BeaconEmail } from './email/email.entity'
import { BeaconEmailService } from './email/email.service'
import { BeaconIm } from './im/im.entity'
import { BeaconImService } from './im/im.service'
import { BeaconNotification } from './notification/notification.entity'
import { BeaconNotificationService } from './notification/notification.service'
import { BeaconPush } from './push/push.entity'
import { BeaconPushService } from './push/push.service'
import { BeaconSms } from './sms/sms.entity'
import { BeaconSmsService } from './sms/sms.service'
import { WebsocketModule } from '../websocket/websocket.module'

@Module({
	imports: [
		ConfigValidationModule.register(BeaconConfigDto),
		TypeOrmModule.forFeature([BeaconEmail, BeaconSms, BeaconPush, BeaconIm, BeaconNotification]),
		WebsocketModule,
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
