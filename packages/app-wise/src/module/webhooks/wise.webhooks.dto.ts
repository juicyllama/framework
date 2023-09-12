import { IsString, IsObject } from 'class-validator'

export class WiseWebhookDeliveryDto {
	@IsString()
	url: string

	@IsString()
	version: '2.0.0'
}
export class WiseWebhookDto {
	@IsString()
	name: string

	@IsString()
	trigger_on: 'balances#credit'

	@IsObject()
	delivery: WiseWebhookDeliveryDto
}
