import { BeaconStatus } from '../beacon.enums';
import { BeaconCommunicationDto } from '../beacon.dto';
export declare class BeaconSms {
    readonly sms_id: number;
    communication: BeaconCommunicationDto;
    app_integration_name?: string;
    app_sms_id?: number;
    markdown: string;
    status?: BeaconStatus;
    unique?: string;
    readonly created_at: Date;
    updated_at: Date;
    sent_at?: Date;
    delivered_at?: Date;
    constructor(partial: Partial<BeaconSms>);
}
