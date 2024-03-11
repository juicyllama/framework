import { Classes } from '@juicyllama/utils'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsString, IsBoolean, IsOptional, IsEmail, MinLength, MaxLength, IsEnum, IsUrl } from 'class-validator'
import { SwaggerPropertyDecorator, SwaggerPropertyType } from '../../decorators/Swagger.decorator'
import { BaseResponseDto } from '../../types/common'
import { UserAvatarType, UserRole } from './users.enums'

export class UserDto {
	@ApiProperty({
		description: 'The users first name',
		example: 'Jon',
		required: false,
	})
	@IsString()
	@MinLength(2)
	@MaxLength(50)
	@IsOptional()
	first_name?: string

	@ApiProperty({
		example: 'Doe',
		required: false,
	})
	@IsString()
	@MinLength(2)
	@MaxLength(50)
	@IsOptional()
	last_name?: string

	@ApiProperty({
		example: 'jon.doe@example.com',
		required: true,
	})
	@IsString()
	@IsEmail()
	email!: string

	@ApiProperty({
		example: 'S7rOngP@s7',
	})
	@IsString()
	@MinLength(8)
	@MaxLength(50)
	@IsOptional()
	/*@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message: 'password too weak',
	})*/
	password?: string

	@ApiProperty({
		example: false,
		required: false,
	})
	@IsBoolean()
	@IsOptional()
	password_reset?: boolean

	@ApiProperty({
		description: 'User avatar type, defualt is NONE',
		example: UserAvatarType.IMAGE,
		required: false,
	})
	@IsEnum(UserAvatarType)
	@IsOptional()
	avatar_type?: UserAvatarType

	@ApiProperty({
		description: 'The URL if the user has an avatar image, default is null',
		example: 'https://example.ext/avatar.jpg',
		required: false,
	})
	@IsUrl()
	@IsOptional()
	avatar_image_url?: string

}

export class CreateUserDto extends UserDto {
	@ApiProperty({
		description: 'The user role',
		example: UserRole.MEMBER,
		required: false,
		enum: UserRole,
	})
	@IsEnum(UserRole)
	@IsOptional()
	role?: UserRole
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UserResponeDto extends Classes.ExtendsMultiple([UserDto, BaseResponseDto]) {
	@SwaggerPropertyDecorator({ description: 'The User ID', example: 1, type: SwaggerPropertyType.NUMBER })
	readonly user_id!: number
}
