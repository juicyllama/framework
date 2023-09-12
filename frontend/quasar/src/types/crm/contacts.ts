import { AvatarType } from '../user'
import { Account } from '../account'
import { User } from '../user'

export enum ContactSubscriptionStatus {
	subscribed = 'subscribed',
	unsubscribed = 'unsubscribed',
	pending = 'pending',
}

export enum ContactEmailType {
	PERSONAL = 'PERSONAL',
	WORK = 'WORK',
	OTHER = 'OTHER',
}

export interface ContactEmail {
	email: string
	type?: ContactEmailType
}

export enum ContactPhoneType {
	MOBILE = 'MOBILE',
	LANDLINE = 'LANDLINE',
	OTHER = 'OTHER',
}

export interface ContactPhone {
	type?: ContactPhoneType
	country_iso?: string
	number: string
	number_local_format?: string
}

export enum ContactSocialType {
	FACEBOOK = 'FACEBOOK',
	INSTAGRAM = 'INSTAGRAM',
	LINKEDIN = 'LINKEDIN',
	TWITTER = 'TWITTER',
	YOUTUBE = 'YOUTUBE',
}

export interface ContactSocial {
	type: ContactSocialType
	handle: string
}

export enum ContactAddressType {
	HOME = 'HOME',
	OFFICE = 'OFFICE',
	OTHER = 'OTHER',
}

export interface ContactAddress {
	type?: ContactAddressType
	address_1?: string
	address_2?: string
	city?: string
	post_code?: string
	state?: string
	country_iso?: string
}

export interface Contact {
	readonly contact_id: number
	readonly account: Account
	first_name?: string
	last_name?: string
	emails?: ContactEmail[]
	phones?: ContactPhone[]
	socials?: ContactSocial[]
	addresses?: ContactAddress[]
	tags?: string[]
	avatar_type?: AvatarType
	avatar_image_url?: string
	dob?: Date
	subscribed_status?: ContactSubscriptionStatus
	added_by?: User
}
