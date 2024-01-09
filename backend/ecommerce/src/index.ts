// Entities
import { Store } from './modules/stores/stores.entity'
import { Transaction } from './modules/transactions/transactions.entity'
import { TransactionDiscount } from './modules/transactions/discounts/discounts.entity'

// Modules
import { EcommerceModule } from './ecommerce.module'
import { StoresModule } from './modules/stores/stores.module'
import { TransactionsModule } from './modules/transactions/transactions.module'
import { TransactionDiscountsModule } from './modules/transactions/discounts/discounts.module'

// Controllers
import { StoresController } from './modules/stores/stores.controller'
import { TransactionsController } from './modules/transactions/transactions.controller'
import { TransactionDiscountsController } from './modules/transactions/discounts/discounts.controller'

// Services
import { StoresService } from './modules/stores/stores.service'
import { TransactionsService } from './modules/transactions/transactions.service'
import { TransactionDiscountsService } from './modules/transactions/discounts/discounts.service'

// Enums
import { StoreSelect, StoreRelations, StoreOrderBy } from './modules/stores/stores.enums'
import {
	TransactionSelect,
	TransactionRelations,
	TransactionOrderBy,
	TransactionPaymentStatus,
	TransactionFulfillmentStatus,
} from './modules/transactions/transactions.enums'
import {
	TransactionDiscountSelect,
	TransactionDiscountRelations,
	TransactionDiscountOrderBy,
	TransactionDiscountType,
} from './modules/transactions/discounts/discounts.enums'

// DTOs
import { StoreDto, CreateStoreDto, UpdateStoreDto } from './modules/stores/stores.dto'
import { TransactionDto, CreateTransactionDto, UpdateTransactionDto } from './modules/transactions/transactions.dto'
import {
	TransactionDiscountDto,
	CreateTransactionDiscountDto,
	UpdateTransactionDiscountDto,
} from './modules/transactions/discounts/discounts.dto'

//Docs
import { installEcommerceDocs } from './docs/install'

export {
	EcommerceModule,
	StoresModule,
	TransactionsModule,
	TransactionDiscountsModule,
	StoresController,
	TransactionsController,
	TransactionDiscountsController,
	StoresService,
	TransactionsService,
	TransactionDiscountsService,
	StoreDto,
	TransactionDto,
	TransactionDiscountDto,
	CreateStoreDto,
	CreateTransactionDto,
	CreateTransactionDiscountDto,
	UpdateStoreDto,
	UpdateTransactionDto,
	UpdateTransactionDiscountDto,
	StoreSelect,
	TransactionSelect,
	TransactionDiscountSelect,
	StoreRelations,
	TransactionRelations,
	TransactionDiscountRelations,
	StoreOrderBy,
	TransactionOrderBy,
	TransactionDiscountOrderBy,
	TransactionPaymentStatus,
	TransactionFulfillmentStatus,
	TransactionDiscountType,
	installEcommerceDocs,
	Store,
	Transaction,
	TransactionDiscount,
}
