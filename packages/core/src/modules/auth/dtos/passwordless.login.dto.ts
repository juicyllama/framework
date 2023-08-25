import { IsEmail, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class InitiatePasswordlessLoginDto {
	@IsEmail()
	@IsString()
	@ApiProperty({
		description: 'The users email address',
		example: 'richard.branson@fly.virgin.com',
	})
	readonly email: string
}
