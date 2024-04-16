import { IsArray, IsBoolean, IsEnum, IsNumber, IsObject, IsString } from 'class-validator'
import {
	AmazonSellerAddressDto,
	AmazonSellerErrorListDto,
	AmazonSellerMoneyDto,
	AmazonSellerTaxClassificationDto,
	AmazonSellerTaxCollectionDto,
} from '../amazon.seller.common.dto'
import { AmazonSellerFulfillmentChannel } from '../amazon.seller.common.enums'
import { AmazonSellerOrderStatus } from './amazon.seller.order.enums'

export class AmazonSellerOrderDto {
	@IsString()
	AmazonOrderId!: string

	@IsString()
	SellerOrderId?: string

	@IsString()
	PurchaseDate!: string

	@IsString()
	LastUpdateDate!: string

	@IsEnum(AmazonSellerOrderStatus)
	OrderStatus!: AmazonSellerOrderStatus

	@IsEnum(AmazonSellerFulfillmentChannel)
	FulfillmentChannel?: AmazonSellerFulfillmentChannel

	@IsString()
	SalesChannel?: string

	@IsString()
	OrderChannel?: string

	@IsString()
	ShipServiceLevel?: string

	@IsObject()
	OrderTotal?: AmazonSellerMoneyDto

	@IsString()
	NumberOfItemsShipped?: string

	@IsString()
	NumberOfItemsUnshipped?: string
}

export class AmazonSellerOrderBuyerInfoTaxDto {
	@IsString()
	CompanyLegalName?: string

	@IsString()
	TaxingRegion?: string

	@IsArray()
	TaxClassifications?: AmazonSellerTaxClassificationDto[]
}

export class AmazonSellerOrderItemBuyerInfoDto {
	@IsObject()
	BuyerCustomizedInfo?: AmazonSellerBuyerCustomizedInfoDetailDto

	@IsObject()
	GiftWrapPrice?: AmazonSellerMoneyDto

	@IsObject()
	GiftWrapTax?: AmazonSellerMoneyDto

	@IsString()
	GiftMessageText?: string

	@IsString()
	GiftWrapLevel?: string
}

export class AmazonSellerOrderBuyerInfoDto {
	@IsString()
	AmazonOrderId!: string

	@IsString()
	BuyerEmail?: string

	@IsString()
	BuyerName?: string

	@IsString()
	BuyerCounty?: string

	@IsObject()
	BuyerTaxInfo!: AmazonSellerOrderBuyerInfoTaxDto

	@IsString()
	PurchaseOrderNumber?: string
}

export class AmazonSellerOrderItemsItemProductInfoDto {
	@IsNumber()
	NumberOfItems?: number
}

export class AmazonSellerOrderItemsItemPointsGrantedDto {
	@IsNumber()
	PointsNumber?: number

	@IsObject()
	PointsMonetaryValue?: AmazonSellerMoneyDto
}

export class AmazonSellerBuyerCustomizedInfoDetailDto {
	@IsString()
	CustomizedURL?: string
}

export class AmazonSellerBuyerRequestedCancelDto {
	@IsBoolean()
	IsBuyerRequestedCancel?: boolean

	@IsString()
	BuyerCancelReason?: string
}

export class AmazonSellerOrderItemsItemDto {
	@IsString()
	ASIN!: string

	@IsString()
	SellerSKU?: string

	@IsString()
	OrderItemId!: string

	@IsString()
	Title?: string

	@IsNumber()
	QuantityOrdered!: number

	@IsNumber()
	QuantityShipped?: number

	@IsObject()
	ProductInfo?: AmazonSellerOrderItemsItemProductInfoDto

	@IsObject()
	PointsGranted?: AmazonSellerOrderItemsItemPointsGrantedDto

	@IsObject()
	ItemPrice?: AmazonSellerMoneyDto

	@IsObject()
	ShippingPrice?: AmazonSellerMoneyDto

	@IsObject()
	ItemTax?: AmazonSellerMoneyDto

	@IsObject()
	ShippingTax?: AmazonSellerMoneyDto

	@IsObject()
	ShippingDiscount?: AmazonSellerMoneyDto

	@IsObject()
	ShippingDiscountTax?: AmazonSellerMoneyDto

	@IsObject()
	PromotionDiscount?: AmazonSellerMoneyDto

	@IsObject()
	PromotionDiscountTax?: AmazonSellerMoneyDto

	@IsArray()
	PromotionIds?: AmazonSellerBuyerCustomizedInfoDetailDto[]

	@IsObject()
	CODFee?: AmazonSellerMoneyDto

	@IsObject()
	CODFeeDiscount?: AmazonSellerMoneyDto

	@IsBoolean()
	IsGift?: boolean

	@IsString()
	ConditionNote?: string

	@IsString()
	ConditionId?: string

	@IsString()
	ConditionSubtypeId?: string

	@IsString()
	ScheduledDeliveryStartDate?: string

	@IsString()
	ScheduledDeliveryEndDate?: string

	@IsString()
	PriceDesignation?: string

	@IsObject()
	TaxCollection?: AmazonSellerTaxCollectionDto

	@IsBoolean()
	SerialNumberRequired?: boolean

	@IsBoolean()
	IsTransparency?: boolean

	@IsString()
	IossNumber?: string

	@IsString()
	StoreChainStoreId?: string

	@IsString()
	DeemedResellerCategory?: string

	@IsObject()
	BuyerInfo?: AmazonSellerOrderItemBuyerInfoDto

	@IsObject()
	BuyerRequestedCancel?: AmazonSellerBuyerRequestedCancelDto
}

export class AmazonSellerOrderItemsDto {
	@IsArray()
	OrderItems!: AmazonSellerOrderItemsItemDto[]

	@IsString()
	NextToken?: string

	@IsString()
	AmazonOrderId!: string
}

export class AmazonSellerOrdersListDto {
	@IsArray()
	Orders!: AmazonSellerOrderDto[]

	@IsString()
	NextToken?: string

	@IsString()
	LastUpdatedBefore?: string

	@IsString()
	CreatedBefore?: string
}

export class AmazonSellerOrderAddressDto {
	@IsString()
	AmazonOrderId!: string

	@IsObject()
	ShippingAddress!: AmazonSellerAddressDto
}

export class AmazonSellerOrderResponseDto {
	@IsObject()
	payload!: AmazonSellerOrderDto

	@IsArray()
	errors!: AmazonSellerErrorListDto[]
}

export class AmazonSellerOrderBuyerInfoResponseDto {
	@IsObject()
	payload!: AmazonSellerOrderBuyerInfoDto

	@IsArray()
	errors!: AmazonSellerErrorListDto[]
}

export class AmazonSellerOrderItemsResponseDto {
	@IsObject()
	payload!: AmazonSellerOrderItemsDto

	@IsArray()
	errors!: AmazonSellerErrorListDto[]
}

export class AmazonSellerOrderAddressResponseDto {
	@IsObject()
	payload!: AmazonSellerOrderAddressDto

	@IsArray()
	errors!: AmazonSellerErrorListDto[]
}

export class AmazonSellerOrdersResponseDto {
	@IsObject()
	payload!: AmazonSellerOrdersListDto

	@IsArray()
	errors!: AmazonSellerErrorListDto[]
}

export class AmazonSellerFullOrderDto {
	@IsObject()
	order?: AmazonSellerOrderDto

	@IsObject()
	items?: AmazonSellerOrderItemsItemDto[]

	@IsObject()
	customer?: AmazonSellerOrderBuyerInfoDto

	@IsObject()
	address?: AmazonSellerAddressDto
}
