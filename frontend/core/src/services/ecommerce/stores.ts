import { Api } from '../../helpers'
import { EcommerceStore } from '../../types'

type T = EcommerceStore
export const ECOMMERCE_STORES_ENDPOINT = '/ecommerce/stores'
export const ECOMMERCE_STORES_EVENT = 'account_${account_id}_ecommerce_stores'

export class EcommerceStoresService extends Api<T> {
    constructor() {
		super(ECOMMERCE_STORES_ENDPOINT)
	  }
}
