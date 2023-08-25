import { BeaconStatus } from '../beacon.enums';
import { BeaconCommunicationDto } from '../beacon.dto';
export declare class BeaconEmail {
    readonly email_id: number;
    communication: BeaconCommunicationDto;
    app_integration_name?: string;
    app_email_id?: number;
    subject: string;
    markdown: string;
    cta?: any;
    status?: BeaconStatus;
    unique?: string;
    readonly created_at: Date;
    updated_at: Date;
    sent_at?: Date;
    delivered_at?: Date;
    constructor(partial: Partial<BeaconEmail>);
}
