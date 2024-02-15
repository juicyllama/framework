import { IsString, IsBoolean } from 'class-validator'

export class NumberVerification {
	@IsString()
	carrier!: string

	@IsString()
	country_code!: string

	@IsString()
	country_name!: string

	@IsString()
	country_prefix!: string

	@IsString()
	international_format!: string

	@IsString()
	line_type!: string

	@IsString()
	local_format!: string

	@IsString()
	location!: string

	@IsString()
	number!: string

	@IsBoolean()
	valid!: boolean
}
