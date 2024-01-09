import { IsString, MinLength, MaxLength, IsOptional, IsEnum, IsEmail } from 'class-validator'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import { SupportedCurrencies } from '@juicyllama/utils'
import { Account } from './account.entity'
import { User } from '../users/users.entity'

export class SuccessAccountDto {
	readonly account: Account
	readonly owner: User
	readonly access_token?: string
}

export class OnboardAccountDto {
	account_id?: number

	@ApiProperty({ description: 'The name of your company', example: 'Example Company Limited' })
	@IsString()
	@MinLength(2)
	@MaxLength(255)
	@IsOptional()
	account_name?: string

	@ApiProperty({
		description: 'The account owners email address',
		example: 'jon.doe@example.com',
		required: true,
	})
	@IsEmail()
	@MinLength(2)
	@MaxLength(50)
	owners_email: string

	@IsString()
	@MinLength(8)
	@MaxLength(50)
	@IsOptional()
	@ApiProperty({
		example: 'S7r0#gP@$s',
		description:
			'Only provide this for new users, existing users will use their existing password and this will be ignored. If not provided a random password will be generated and emailed to the user.',
	})
	owners_password?: string

	@IsString()
	@MinLength(1)
	@MaxLength(50)
	@IsOptional()
	@ApiProperty({
		example: 'Jon',
		description: 'The account owners first name, this will be ignored if the user already exists',
		required: false,
	})
	owners_first_name?: string

	@IsString()
	@MinLength(1)
	@MaxLength(50)
	@IsOptional()
	@ApiProperty({
		example: 'Doe',
		description: 'The account owners last name, this will be ignored if the user already exists',
		required: false,
	})
	owners_last_name?: string

	@IsEnum(SupportedCurrencies)
	@MinLength(3)
	@MaxLength(3)
	@IsOptional()
	@ApiProperty({
		example: SupportedCurrencies.USD,
		description: 'The default currency for your account.',
		enum: SupportedCurrencies,
		required: false,
	})
	currency?: SupportedCurrencies
}

export class OnboardAdditionalAccountDto {
	@ApiProperty({ description: 'The name of your company', example: 'Example' })
	@IsString()
	@MinLength(2)
	@MaxLength(255)
	account_name: string

	@IsEnum(SupportedCurrencies)
	@MinLength(3)
	@MaxLength(3)
	@IsOptional()
	@ApiProperty({
		example: SupportedCurrencies.USD,
		description: 'The default currency for your account.',
		enum: SupportedCurrencies,
		required: false,
	})
	currency?: SupportedCurrencies
}

export class AccountDto {
	account_id: number

	@ApiProperty({ description: 'The name of your company', example: 'Example' })
	@IsString()
	@MinLength(2)
	@MaxLength(255)
	account_name: string

	@IsEnum(SupportedCurrencies)
	@MinLength(3)
	@MaxLength(3)
	@IsOptional()
	@ApiProperty({
		example: SupportedCurrencies.USD,
		description: 'The default currency for your account.',
		required: false,
	})
	currency?: SupportedCurrencies

	@ApiProperty({ description: 'Company Legal Trading Name', example: 'Example Company Limited' })
	@IsString()
	@IsOptional()
	@MaxLength(255)
	company_name?: string

	@ApiProperty({ description: 'Company Registered Address Line 1', example: '1 Some Street' })
	@IsString()
	@IsOptional()
	@MaxLength(255)
	address_1?: string

	@ApiProperty({ description: 'Company Registered Address Line 2', example: 'Some Area' })
	@IsString()
	@IsOptional()
	@MaxLength(255)
	address_2?: string

	@ApiProperty({ description: 'Company Registered City', example: 'Some City' })
	@IsString()
	@IsOptional()
	@MaxLength(255)
	city?: string

	@ApiProperty({ description: 'Company Registered Post Code', example: 'S0 M3' })
	@IsString()
	@IsOptional()
	@MaxLength(255)
	postcode?: string

	@ApiProperty({ description: 'Company Registered State', example: 'Some State' })
	@IsString()
	@IsOptional()
	@MaxLength(255)
	state?: string

	@ApiProperty({ description: 'Company Registered Country', example: 'GB' })
	@IsString()
	@IsOptional()
	@MinLength(2)
	@MaxLength(2)
	country?: string

	@ApiProperty({ description: 'Company Finance Email', example: 'finance@example.com' })
	@IsEmail()
	@IsOptional()
	@MaxLength(255)
	finance_email?: string
}

export class CreateAccountDto extends AccountDto {}

export class UpdateAccountDto extends PartialType(AccountDto) {}
