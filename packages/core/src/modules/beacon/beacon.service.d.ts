import { BeaconMessageDto } from './beacon.dto';
import { BeaconEmailService } from './email/email.service';
import { BeaconPushService } from './push/push.service';
import { BeaconSmsService } from './sms/sms.service';
import { BeaconNotificationService } from './notification/notification.service';
import { BeaconImService } from './im/im.service';
export declare class BeaconService {
    private readonly beaconEmailService;
    private readonly beaconPushService;
    private readonly beaconSmsService;
    private readonly beaconImService;
    private readonly beaconNotificationService;
    constructor(beaconEmailService: BeaconEmailService, beaconPushService: BeaconPushService, beaconSmsService: BeaconSmsService, beaconImService: BeaconImService, beaconNotificationService: BeaconNotificationService);
    notify(message: BeaconMessageDto): Promise<boolean>;
    sendPush(event: string, json: any): Promise<void>;
}
