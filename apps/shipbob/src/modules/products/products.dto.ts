import { IsString, IsNumber, IsEnum, IsDate, IsObject, IsArray } from 'class-validator'
import { ShipbobChannel, ShipbobFindParams } from '../shipbob.common.dto'
import { ShipbobProductActiveStatus, ShipbobProductBundleStatus } from './products.enums'

export class ShipbobProductBundle {
	@IsNumber()
	id!: number

	@IsString()
	name!: string
}

export class ShipbobProductFulfillableInventoryItems {
	@IsNumber()
	id!: number

	@IsString()
	name!: string

	@IsNumber()
	quantity!: number
}

export class ShipbobProductFulfillableQtyByLocation {
	@IsNumber()
	id!: number

	@IsString()
	name!: string

	@IsNumber()
	fulfillable_quantity!: number

	@IsNumber()
	onhand_quantity!: number

	@IsNumber()
	committed_quantity!: number
}

export class ShipbobProduct {
	@IsNumber()
	id!: number

	@IsString()
	reference_id!: string

	@IsArray()
	bundle_root_information?: ShipbobProductBundle[]

	@IsDate()
	created_date?: Date

	@IsObject()
	channel?: ShipbobChannel

	@IsString()
	sku!: string

	@IsString()
	name!: string

	@IsString()
	barcode?: string

	@IsString()
	gtin?: string

	@IsString()
	upc?: string

	@IsString()
	unit_price?: string

	@IsNumber()
	total_fulfillable_quantity!: number

	@IsNumber()
	total_onhand_quantity!: number

	@IsNumber()
	total_committed_quantity!: number

	@IsArray()
	fulfillable_inventory_items?: ShipbobProductFulfillableInventoryItems[]

	@IsArray()
	fulfillable_quantity_by_fulfillment_center?: ShipbobProductFulfillableQtyByLocation[]
}

export class ShipbobProductFindParams extends ShipbobFindParams {
	@IsEnum(ShipbobProductActiveStatus)
	ActiveStatus?: ShipbobProductActiveStatus

	@IsEnum(ShipbobProductBundleStatus)
	BundleStatus?: ShipbobProductBundleStatus
}
