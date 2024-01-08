import { IsArray, IsBoolean, IsObject, IsString, IsUrl } from 'class-validator'
import { BeaconCommunicationEmailDto } from './email/email.dto.js'
import { UserRole } from '../users/users.enums.js'
import { Account } from '../accounts/account.entity.js'
import { BeaconCommunicationImDto } from './im/im.dto.js'

export class BeaconMethodsDto {
	@IsBoolean()
	email?: boolean

	@IsBoolean()
	sms?: boolean

	@IsBoolean()
	im?: boolean

	@IsBoolean()
	webhook?: boolean

	@IsBoolean()
	push?: boolean

	@IsBoolean()
	notification?: boolean
}

export class BeaconCommunicationDto {
	@IsObject()
	email?: BeaconCommunicationEmailDto

	@IsString()
	phone?: string //the phone number to send the message to

	@IsString()
	event?: string

	@IsObject()
	im?: BeaconCommunicationImDto
}

export class BeaconMessageCtaDto {
	@IsString()
	text: string

	@IsUrl()
	url: string
}

export class BeaconOptionsDto {
	//if true, the json will not be saved to the database
	@IsBoolean()
	skipJsonSave?: boolean

	// if you wish to filter the users that receive the message, you can specify the roles here
	// todo
	//   - [ ] Support for email
	//   - [ ] Support for sms
	//   - [ ] Support for im
	//   - [ ] Support for webhook
	//   - [ ] Support for push
	//   - [x] Support for notification
	@IsArray()
	roles?: UserRole[]
}

export class BeaconMessageDto {
	@IsObject()
	methods: BeaconMethodsDto

	@IsObject()
	communication: BeaconCommunicationDto

	@IsString()
	subject?: string

	//the message to send, for email this is the body of the email for sms this is the body of the message
	@IsString()
	markdown?: string

	@IsObject()
	cta?: BeaconMessageCtaDto

	@IsObject()
	json?: any

	@IsObject()
	options?: BeaconOptionsDto

	//required for notifications
	@IsObject()
	account?: Account

	//if you wish to check for duplicate messages, you can specify a unique identifier here
	@IsString()
	unique?: string
}
