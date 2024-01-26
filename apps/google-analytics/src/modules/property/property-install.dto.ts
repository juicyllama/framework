import { IsNumberString } from 'class-validator'

export class PropertyInstallDto {
	@IsNumberString()
	propertyId: string;
}
