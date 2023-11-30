import { Inject } from '@nestjs/common'

export const SHOPIFY_PROVIDER_TOKEN = 'TOKEN:SHOPIFY_PROVIDER'

export const InjectShopify = () => Inject(SHOPIFY_PROVIDER_TOKEN)
