import { IsObject } from 'class-validator'

export class BeaconCommunicationImSlackDto {
	channel!: string
	text?: string
	as_user?: boolean
	attachments?: any[]
	blocks?: any[]
	icon_emoji?: string
	icon_url?: string
	metadata?: any
	link_names?: boolean
	mrkdwn?: boolean
	parse?: 'full' | 'none'
	reply_broadcast?: boolean
	thread_ts?: string
	unfurl_links?: boolean
	unfurl_media?: boolean
	username?: string
}

export class BeaconCommunicationImDto {
	@IsObject()
	slack!: BeaconCommunicationImSlackDto
}
