import { BeaconStatus } from '../beacon.enums';
export declare class BeaconPushResponseDto {
    app_push_id: number;
    status: BeaconStatus;
}
export declare class BeaconPushRequestDto {
    channel: string;
    event: string;
    data?: any;
}
