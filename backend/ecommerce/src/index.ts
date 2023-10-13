// Entities
import { Store } from './stores/stores.entity'
import { Transaction } from './transactions/transactions.entity'
import { TransactionDiscount } from './transactions/discounts/discounts.entity'

// Modules
import { EcommerceModule } from './ecommerce.module'
import { StoresModule } from './stores/stores.module'
import { TransactionsModule } from './transactions/transactions.module'
import { TransactionDiscountsModule } from './transactions/discounts/discounts.module'

// Controllers
import { StoresController } from './stores/stores.controller'
import { TransactionsController } from './transactions/transactions.controller'
import { TransactionDiscountsController } from './transactions/discounts/discounts.controller'

// Services
import { StoresService } from './stores/stores.service'
import { TransactionsService } from './transactions/transactions.service'
import { TransactionDiscountsService } from './transactions/discounts/discounts.service'

// Enums
import { StoreSelect, StoreRelations, StoreOrderBy } from './stores/stores.enums'
import { TransactionSelect, TransactionRelations, TransactionOrderBy, TransactionPaymentStatus, TransactionFulfillmentStatus } from './transactions/transactions.enums'
import { TransactionDiscountSelect, TransactionDiscountRelations, TransactionDiscountOrderBy, TransactionDiscountType } from './transactions/discounts/discounts.enums'

// DTOs
import { StoreDto, CreateStoreDto, UpdateStoreDto } from './stores/stores.dto'
import { TransactionDto, CreateTransactionDto, UpdateTransactionDto } from './transactions/transactions.dto'
import { TransactionDiscountDto, CreateTransactionDiscountDto, UpdateTransactionDiscountDto } from './transactions/discounts/discounts.dto'

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
