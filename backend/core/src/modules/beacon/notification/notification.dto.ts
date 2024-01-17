import { IsEnum, IsNumber, IsObject, IsString } from 'class-validator'
import { BeaconStatus } from '../beacon.enums'

export class BeaconPushResponseDto {
	@IsNumber()
	app_push_id!: number

	@IsEnum(BeaconStatus)
	status!: BeaconStatus
}

export class BeaconPushRequestDto {
	@IsString()
	channel!: string

	@IsString()
	event!: string

	@IsObject()
	data?: any
}
