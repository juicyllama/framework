import { BeaconCommunicationEmailDto } from './email/email.dto';
import { UserRole } from '../users/users.enums';
import { Account } from '../accounts/account.entity';
import { BeaconCommunicationImDto } from './im/im.dto';
export declare class BeaconMethodsDto {
    email?: boolean;
    sms?: boolean;
    im?: boolean;
    webhook?: boolean;
    push?: boolean;
    notification?: boolean;
}
export declare class BeaconCommunicationDto {
    email?: BeaconCommunicationEmailDto;
    phone?: string;
    event?: string;
    im?: BeaconCommunicationImDto;
}
export declare class BeaconMessageCtaDto {
    text: string;
    url: string;
}
export declare class BeaconOptionsDto {
    skipJsonSave?: boolean;
    roles?: UserRole[];
}
export declare class BeaconMessageDto {
    methods: BeaconMethodsDto;
    communication: BeaconCommunicationDto;
    subject?: string;
    markdown?: string;
    cta?: BeaconMessageCtaDto;
    json?: any;
    options?: BeaconOptionsDto;
    account?: Account;
    unique?: string;
}
