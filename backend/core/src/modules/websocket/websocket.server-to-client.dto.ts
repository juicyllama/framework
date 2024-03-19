import { IsObject, IsOptional, IsString } from 'class-validator'

export class WebsocketServerToClientDto {
	@IsString()
	event!: string

	@IsOptional()
	@IsObject()
	json?: any
}
