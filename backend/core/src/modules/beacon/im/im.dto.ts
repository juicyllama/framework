import { IsObject, IsString } from 'class-validator'

export class BeaconCommunicationImSlackDto {
	@IsString()
	channel!: string
}

export class BeaconCommunicationImDto {
	@IsObject()
	slack!: BeaconCommunicationImSlackDto
}
