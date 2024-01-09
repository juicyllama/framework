# CRUD Controller

A set of pre-built CRUD controllers for your NestJS application.

Simply import, call the methods in your controllers to leverage all the benefits of the framework.

::alert{type="info"}
These methods use the service methods under the hood. If you want to learn more about the service methods, check out the [Service](/backend/core/helpers/service) documentation.

This means that all the data is automatically cached and push messages sent to your frontend applications.
::

## Usage

Import the helpers into your controller:

```typescript
import { Controller, forwardRef, Inject, Body, Query, Param, Req, UploadedFile } from '@nestjs/common'
import {
	Query as TQuery,
	UserAuth,
	CreateDecorator,
	ReadManyDecorator,
	ReadOneDecorator,
	ReadStatsDecorator,
	ReadChartsDecorator,
	UpdateDecorator,
	DeleteDecorator,
	BaseController,
	AuthService,
	AccountId,
	BulkUploadDecorator,
	BulkUploadDto,
	BulkUploadResponse,
	UploadFieldsDecorator,
	CrudUploadFieldsResponse,
} from '@juicyllama/core'
import { ChartsPeriod, ChartsResponseDto, StatsMethods } from '@juicyllama/utils'
import { ApiTags } from '@nestjs/swagger'
```

If you require user authentication include:

```typescript
@UserAuth()
```

Specify the documentation Tag: 

```typescript
@ApiTags('Animals')
```

Choose the endpoint url: 

```typescript
@Controller(`/animals`)
```

Make sure you extend your controller with the base controller and inject the relevent items up to the BaseController

```typescript
export class AnimalsController extends BaseController<T> {
	constructor(
		@Inject(forwardRef(() => AuthService)) readonly authService: AuthService,
		@Inject(forwardRef(() => Service)) readonly service: Service,
		@Inject(forwardRef(() => TQuery)) readonly tQuery: TQuery<T>,
	) {
		super(service, tQuery, constants, {
			services: {
				authService,
			},
		})
	}
}
```

## Methods

The following methods can be used in your application:

### Create

Create a new object in the database.

```typescript
@CreateDecorator(constants)
async create(@Req() req, @Body() body: CreateDto, @AccountId() account_id: number): Promise<T> {
	return super.create(req, body, account_id)
}
```

### FindAll

Find all objects in the database.

```typescript
@ReadManyDecorator(constants)
async findAll(@Req() req, @Query() query, @AccountId() account_id: number): Promise<T[]> {
	return super.findAll(req, query, account_id)
}
```

### FindOne

Find one object in the database.

```typescript
@ReadOneDecorator(constants)
async findOne(@Req() req, @AccountId() account_id: number, @Param() params, @Query() query): Promise<T> {
	return super.findOne(req, account_id, params, query)
}
```

### Stats

Get stats about the objects in the database.

```typescript
@ReadStatsDecorator(constants)
async stats(
	@Req() req,
	@Query() query,
	@AccountId() account_id: number,
	@Query('method') method: StatsMethods,
): Promise<any> {
	return super.stats(req, query, account_id, method)
}
```

### Charts

Get datasets for pie/line charts from the database.

```typescript
@ReadChartsDecorator(constants)
async charts(
	@Req() req,
	@AccountId() account_id: number,
	@Query() query: any,
	@Query('search') search: string,
	@Query('from') from: string,
	@Query('to') to: string,
	@Query('fields') fields: string[],
	@Query('period') period?: ChartsPeriod,
): Promise<ChartsResponseDto> {
	return super.charts(req, account_id, query, search, from, to, fields, period)
}
```

### Bulk Upload

```typescript
@BulkUploadDecorator(constants)
async bulkUpload(
	@Req() req,
	@Body() body: BulkUploadDto,
	@AccountId() account_id: number,
	@UploadedFile() file?: Express.Multer.File,
): Promise<BulkUploadResponse> {
	return super.bulkUpload(req, body, account_id, file)
}
```

### Bulk Upload Fields

```typescript
@UploadFieldsDecorator(constants)
async uploadFileFields(): Promise<CrudUploadFieldsResponse> {
	return super.uploadFileFields()
}
```

### Update

Update an object in the database.

```typescript
@UpdateDecorator(constants)
async update(@Req() req, @AccountId() account_id: number, @Body() data: UpdateDto, @Param() params): Promise<T> {
	return super.update(req, account_id, data, params)
}
```

### Delete

Delete an object in the database.

```typescript
@DeleteDecorator(constants)
async remove(@Req() req, @Param() params, @AccountId() account_id: number): Promise<T> {
	return super.remove(req, params, account_id)
}
```

## Currency Conversion

The `findAll` `findOne` and `charts` endpoints support currency conversion, this means that the results will be converted into a specific currency before being returned.

You can pass details into both the Decorator and the Controller as follows:

```typescript
import { FxService } from '@juicyllama/core'
//inject FxService into the constructor

const CURRENCY_FIELD = 'currency' // the field containing the current of the record
const CURRENCY_FIELDS = ['total', 'amount'] //the fields containing amounts to be converted

export class AnimalsController extends BaseController<T> {
	constructor(
		@Inject(forwardRef(() => AuthService)) readonly authService: AuthService,
		@Inject(forwardRef(() => Service)) readonly service: Service,
		@Inject(forwardRef(() => FxService)) readonly fxService: FxService,
		@Inject(forwardRef(() => TQuery)) readonly tQuery: TQuery<T>,
	) {
		super(service, tQuery, constants, {
			services: {
				authService,
				fxService,
			},
		})
	}

	@ReadOneDecorator(constants)
	async findOne(@Req() req, @AccountId() account_id: number, @Param() params, @Query() query): Promise<T> {
		return super.findOne(req, account_id, params, query)
	}
}
```

This will expose a new option `convert_currencies_to` on the endpoint. Which will return the `CURRENCY_FIELDS` in the currency passed in the `convert_currencies_to` option.
