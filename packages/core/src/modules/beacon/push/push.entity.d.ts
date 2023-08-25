import { BeaconStatus } from '../beacon.enums';
export declare class BeaconPush {
    readonly push_id: number;
    event: string;
    data?: any;
    app_integration_name?: string;
    status: BeaconStatus;
    unique?: string;
    readonly created_at: Date;
    updated_at: Date;
    pushed_at?: Date;
    constructor(partial: Partial<BeaconPush>);
}
