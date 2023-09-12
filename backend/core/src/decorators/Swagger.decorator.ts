import { applyDecorators } from '@nestjs/common'
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsDate, IsEmail, IsEnum, IsNumber, IsObject, IsOptional, IsString } from 'class-validator'

export enum SwaggerPropertyType {
	STRING,
	NUMBER,
	BOOLEAN,
	DATE,
	ARRAY,
	OBJECT,
	ENUM,
	EMAIL,
}

export enum SwaggerPropertyReference {
	ACCOUNT = 'ACCOUNT',
	ACCOUNTS = 'ACCOUNTS',
	CONTACTS = 'CONTACTS',
	USER = 'USER',
	USERS = 'USERS',
}

export function SwaggerPropertyDecorator(options: {
	ref?: SwaggerPropertyReference
	type?: SwaggerPropertyType
	required?: boolean
	hidden?: boolean
	description?: string
	example?: string | number | boolean | Date | object
	enum?: any
}) {
	const decorators: PropertyDecorator[] = []

	if (options.ref && !options.hidden) {
		switch (options.ref) {
			case SwaggerPropertyReference.ACCOUNT:
				decorators.push(
					ApiProperty({
						description: `The account this records relates to, see <a href="/#tag/Account">Account</a>`,
					}),
				)
				decorators.push(IsObject())
				break
			case SwaggerPropertyReference.ACCOUNTS:
				decorators.push(
					ApiProperty({
						description: `A list of accounts, see <a href="/#tag/Account">Account</a>`,
					}),
				)
				decorators.push(IsArray())
				break
			case SwaggerPropertyReference.CONTACTS:
				decorators.push(
					ApiProperty({
						description: `A list of contacts, see <a href="/#tag/Contacts">Contacts</a>`,
					}),
				)
				decorators.push(IsArray())
				break
			case SwaggerPropertyReference.USER:
				decorators.push(
					ApiProperty({
						description: `The user this records relates to, see <a href="/#tag/Users">Users</a>`,
					}),
				)
				decorators.push(IsObject())
				break
			case SwaggerPropertyReference.USERS:
				decorators.push(
					ApiProperty({
						description: `A list of users, see <a href="/#tag/Users">Users</a>`,
					}),
				)
				decorators.push(IsArray())
				break
		}
	}

	if (!options.required) {
		decorators.push(IsOptional())
	}

	if (options.hidden) {
		decorators.push(ApiHideProperty())
	}

	if (!options.hidden) {
		decorators.push(
			ApiProperty({
				description: options.description,
				example: options.example,
				required: options.required,
				enum: options.enum,
			}),
		)
	}

	let typeDecorator: PropertyDecorator

	switch (options.type) {
		case SwaggerPropertyType.STRING:
			typeDecorator = IsString()
			break
		case SwaggerPropertyType.NUMBER:
			typeDecorator = IsNumber()
			break
		case SwaggerPropertyType.BOOLEAN:
			typeDecorator = IsBoolean()
			break
		case SwaggerPropertyType.DATE:
			typeDecorator = IsDate()
			break
		case SwaggerPropertyType.ARRAY:
			typeDecorator = IsArray()
			break
		case SwaggerPropertyType.OBJECT:
			typeDecorator = IsObject()
			break
		case SwaggerPropertyType.ENUM:
			typeDecorator = IsEnum(options.enum)
			break
		case SwaggerPropertyType.EMAIL:
			typeDecorator = IsEmail()
			break
		default:
			typeDecorator = IsString()
	}

	decorators.push(typeDecorator)
	return applyDecorators(...decorators)
}
