import { InstalledApp } from '@juicyllama/app-store'
import { IsString, IsObject } from 'class-validator'

export class ShipbobEnvConfigDto {
	@IsString()
	SHIPBOB_PAT_TOKEN?: string
}

export class ShipbobConfigDto {
	@IsObject()
	env?: ShipbobEnvConfigDto

	@IsObject()
	installed_app?: InstalledApp
}
