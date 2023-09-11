import { IsEmail, IsEnum, IsNumber, IsObject, IsString } from 'class-validator'
import { BeaconStatus } from '../beacon.enums'
import { BeaconCommunicationDto, BeaconMessageCtaDto } from '../beacon.dto'

export class BeaconEmailResponseDto {
	@IsNumber()
	app_email_id: number

	@IsEnum(BeaconStatus)
	status: BeaconStatus
}

export class BeaconCommunicationEmailDetailsDto {
	@IsString()
	name: string

	@IsEmail()
	email: string
}

export class BeaconCommunicationEmailDto {
	@IsObject()
	from?: BeaconCommunicationEmailDetailsDto

	@IsObject()
	to: BeaconCommunicationEmailDetailsDto
}

export class BeaconEmailRequestDto {
	@IsObject()
	communication: BeaconCommunicationDto

	@IsString()
	subject: string

	@IsString()
	markdown: string

	@IsObject()
	cta?: BeaconMessageCtaDto

	@IsObject()
	json?: any
}
