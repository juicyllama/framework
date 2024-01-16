import { IsString, IsEmail, IsEnum, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { UserRole } from '../../users/users.enums'

export class AuthDto {
	@IsNumber()
	@ApiProperty({
		description: 'The user id',
		example: 1,
	})
	readonly user_id!: number

	@IsString()
	@IsEmail()
	@ApiProperty({
		description: 'The users email address',
		example: 'jon.doe@example.com',
	})
	readonly email!: string

	@IsEnum(UserRole)
	@ApiProperty({
		description: 'The users role, only updatable by `ADMIN` and `OWNER` users',
		required: false,
		example: 'MEMBER',
	})
	readonly role?: UserRole
}
