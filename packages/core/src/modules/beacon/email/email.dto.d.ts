import { BeaconStatus } from '../beacon.enums';
import { BeaconCommunicationDto, BeaconMessageCtaDto } from '../beacon.dto';
export declare class BeaconEmailResponseDto {
    app_email_id: number;
    status: BeaconStatus;
}
export declare class BeaconCommunicationEmailDetailsDto {
    name: string;
    email: string;
}
export declare class BeaconCommunicationEmailDto {
    from?: BeaconCommunicationEmailDetailsDto;
    to: BeaconCommunicationEmailDetailsDto;
}
export declare class BeaconEmailRequestDto {
    communication: BeaconCommunicationDto;
    subject: string;
    markdown: string;
    cta?: BeaconMessageCtaDto;
    json?: any;
}
