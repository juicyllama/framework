import { IsNumberString } from 'class-validator'

export class SandboxAppInstallDto {
	@IsNumberString()
	propertyId: string
}
