// todo move exports into index.ts folder strucutre for cleaner imports

//entities
export { FxRate } from './modules/fx/fx.entity.js'
export { Tag } from './modules/tags/tags.entity.js'
export { Setting } from './modules/settings/settings.entity.js'
export { Role } from './modules/auth/role.entity.js'
export { User } from './modules/users/users.entity.js'
export { Account } from './modules/accounts/account.entity.js'
export { BeaconEmail } from './modules/beacon/email/email.entity.js'

// Modules
export { CoreModule } from './modules/core.module.js'
export { AccountModule } from './modules/accounts/account.module.js'
export { AuthModule } from './modules/auth/auth.module.js'
export { UsersModule } from './modules/users/users.module.js'
export { TagsModule } from './modules/tags/tags.module.js'
export { SettingsModule } from './modules/settings/settings.module.js'
export { FxModule } from './modules/fx/fx.module.js'
export { BeaconModule } from './modules/beacon/beacon.module.js'
export { StorageModule } from './modules/storage/storage.module.js'

//controllers
export { AccountController } from './modules/accounts/account.controller.js'
export { UsersController } from './modules/users/users.controller.js'
export { AuthController } from './modules/auth/auth.controller.js'

// Services
export { TagsService } from './modules/tags/tags.service.js'
export { SettingsService } from './modules/settings/settings.service.js'
export { FxService } from './modules/fx/fx.service.js'
export { AuthService } from './modules/auth/auth.service.js'
export { UsersService } from './modules/users/users.service.js'
export { AccountService } from './modules/accounts/account.service.js'
export { BeaconService } from './modules/beacon/beacon.service.js'
export { BeaconEmailService } from './modules/beacon/email/email.service.js'
export { StorageService } from './modules/storage/storage.service.js'

// Enums
export {
	UserOrderBy,
	UserRelations,
	UserRole,
	UserRoleNum,
	UserSelect,
	UserAvatarType,
} from './modules/users/users.enums.js'
export { AccountOrderBy, AccountRelations, AccountSelect } from './modules/accounts/account.enums.js'
export { BeaconStatus } from './modules/beacon/beacon.enums.js'
export { StorageFileFormat, StorageFileType } from './modules/storage/storage.enums.js'

// DTOs
export { CreateUserDto, UpdateUserDto, UserDto } from './modules/users/users.dto.js'
export { AccountDto, OnboardAccountDto } from './modules/accounts/account.dto.js'
export { BeaconEmailRequestDto, BeaconEmailResponseDto } from './modules/beacon/email/email.dto.js'
export {
	BeaconMessageDto,
	BeaconCommunicationDto,
	BeaconMethodsDto,
	BeaconMessageCtaDto,
} from './modules/beacon/beacon.dto.js'

//Guards
export { CronGuard } from './modules/auth/guards/cron.guard.js'
export { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard.js'

//Utils
export { CustomNamingStrategy } from './utils/typeorm/naming.strategy.js'
export { Query } from './utils/typeorm/Query.js'
export { TypeOrm } from './utils/typeorm/TypeOrm.js'
export { TypeOrmFilter } from './utils/typeorm/TypeOrmFilter.js'
export { CacheService } from './utils/typeorm/Cache.js'
export { RmqModule } from './utils/rabbitmq/rmq.module.js'
export { RmqService } from './utils/rabbitmq/rmq.service.js'

export * from './configs/index.js'
export { MONGODB } from './constants.js'

export {
	AccountId,
	CreateDecorator,
	ReadOneDecorator,
	ReadManyDecorator,
	ReadStatsDecorator,
	ReadChartsDecorator,
	UpdateDecorator,
	UploadFileDecorator,
	DeleteDecorator,
	SwaggerPropertyType,
	SwaggerPropertyReference,
	SwaggerPropertyDecorator,
	UserAuth,
} from './decorators/index.js'
export {
	BaseEntity,
	BaseService,
	crudCreate,
	crudFindOne,
	crudFindAll,
	crudStats,
	crudCharts,
	crudUpdate,
	crudDelete,
	crudPurge,
	CronRunner,
} from './helpers/index.js'
export { MiddlewareAccountId } from './middleware/index.js'
export {
	testCleanup,
	TestEndpoint,
	TestService,
	MockAccountRequest,
	MockUserRequest,
	ScaffoldDto,
	Scaffold,
} from './test/index.js'
export { AppIntegrationName, HTTP_METHODS, METHOD, CRUD_ACTIONS, PromiseLoopOutcomes, OauthInterface } from './types/index.js'
