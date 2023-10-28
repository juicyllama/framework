import { IsBoolean, IsNumber, IsObject, IsString } from 'class-validator'

export class CurrencyData {
	@IsString()
	readonly date: string

	@IsBoolean()
	readonly historical: boolean

	//{ "USDAED": 3.67266, "USDALL": 96.848753, ... }
	@IsObject()
	readonly quotes: any

	@IsString()
	readonly source: string

	@IsBoolean()
	readonly success: boolean

	@IsNumber()
	readonly timestamp: number
}
