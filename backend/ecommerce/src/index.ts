// Entities
export { Store } from './modules/stores/stores.entity'
export { Transaction } from './modules/transactions/transactions.entity'
export { TransactionDiscount } from './modules/transactions/discounts/discounts.entity'

// Modules
export { EcommerceModule } from './ecommerce.module'
export { StoresModule } from './modules/stores/stores.module'
export { TransactionsModule } from './modules/transactions/transactions.module'
export { TransactionDiscountsModule } from './modules/transactions/discounts/discounts.module'

// Controllers
export { StoresController } from './modules/stores/stores.controller'
export { TransactionsController } from './modules/transactions/transactions.controller'
export { TransactionDiscountsController } from './modules/transactions/discounts/discounts.controller'

// Services
export { StoresService } from './modules/stores/stores.service'
export { TransactionsService } from './modules/transactions/transactions.service'
export { TransactionDiscountsService } from './modules/transactions/discounts/discounts.service'

// Enums
export { StoreSelect, StoreRelations, StoreOrderBy } from './modules/stores/stores.enums'
export {
	TransactionSelect,
	TransactionRelations,
	TransactionOrderBy,
	TransactionPaymentStatus,
	TransactionFulfillmentStatus,
} from './modules/transactions/transactions.enums'
export {
	TransactionDiscountSelect,
	TransactionDiscountRelations,
	TransactionDiscountOrderBy,
	TransactionDiscountType,
} from './modules/transactions/discounts/discounts.enums'

// DTOs
export { StoreDto, CreateStoreDto, UpdateStoreDto } from './modules/stores/stores.dto'
export { TransactionDto, CreateTransactionDto, UpdateTransactionDto } from './modules/transactions/transactions.dto'
export {
	TransactionDiscountDto,
	CreateTransactionDiscountDto,
	UpdateTransactionDiscountDto,
} from './modules/transactions/discounts/discounts.dto'

//Docs
export { installEcommerceDocs } from './docs/install'