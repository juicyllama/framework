import { IsUrl, IsBoolean, IsString, IsOptional } from 'class-validator'

export class StorageWriteResponseDto {
	/**
	 * If the file was uploaded successfully
	 */

	@IsBoolean()
	success: boolean

	/**
	 * The url of the file online
	 * @example https://some.location/file.ext
	 */

	@IsUrl()
	@IsOptional()
	url?: string

	/**
	 * An error message if the upload errored
	 */

	@IsString()
	@IsOptional()
	error?: string
}
