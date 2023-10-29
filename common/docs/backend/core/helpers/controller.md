# CRUD Controller

A set of pre-built CRUD controllers for your NestJS application.

Simply import, call the methods in your controllers to leverage all the benefits of the framework.

::: tip
These methods use the service methods under the hood. If you want to learn more about the service methods, check out the [Service](/backend/core/helpers/service) documentation.

This means that all the data is automatically cached and push messages sent to your frontend applications.
:::

## Usage

Import the helpers into your controller:

```typescript
import {
	crudCreate,
	crudFindAll,
	crudFindOne,
	crudStats,
	crudUpdate,
	crudDelete,
	Query as TQuery,
	UserAuth,
	CreateDecorator,
	ReadManyDecorator,
	ReadOneDecorator,
	ReadStatsDecorator,
	ReadChartsDecorator,
	UpdateDecorator,
	DeleteDecorator,
} from '@juicyllama/core'
import { ChartsPeriod, ChartsResponseDto, StatsMethods, StatsResponseDto } from '@juicyllama/utils'
```

## Methods

The following methods can be used in your application:

### Create

Create a new object in the database.

```typescript
@CreateDecorator({entity: E, name: NAME})
async create(@Body() data: CreateExampleDto): Promise<T> {
    return await crudCreate<T>({
        service: this.service,
        data: data,
	})
}
```

### FindAll

Find all objects in the database.

```typescript
@ReadManyDecorator({
    entity: E, 
    selectEnum: ExampleSelect, 
    orderByEnum: ExampleOrderBy,
    relationsEnum: ExampleRelations, 
    name: NAME
})
async findAll(@AccountId() account_id: number, @Query() query): Promise<T[]> {
	return await crudFindAll<T>({
		service: this.service,
		tQuery: this.tQuery,
		account_id: account_id,
		query: query,
		searchFields: SEARCH_FIELDS,
		order_by: DEFAULT_ORDER_BY,
	})
}
```

### FindOne

Find one object in the database.

```typescript
@ReadOneDecorator({
    entity: E, 
    primaryKey: PRIMARY_KEY, 
    selectEnum: ExampleSelect, 
    relationsEnum: ExampleRelations, 
    name: NAME
})
async findOne(@Req() req, @AccountId() account_id: number, @Param() params, @Query() query): Promise<T> {
	return await crudFindOne<T>({
		service: this.service,
		query: query,
		primaryKey: params[PRIMARY_KEY],
	})
}
```

### Stats

Get stats about the objects in the database.

```typescript
@ReadStatsDecorator({name: NAME})
	async stats(
		@AccountId() account_id: number,
		@Query() query,
		@Query('method') method?: StatsMethods,
	): Promise<StatsResponseDto> {
		return await crudStats<T>({
			service: this.service,
			tQuery: this.tQuery,
			account_id: account_id,
			query: query,
			method: method,
			searchFields: SEARCH_FIELDS,
		})
	}
```


### Charts

Get datasets for pie/line charts from the database.

```typescript
	@ReadChartsDecorator({
		entity: E,
		name: NAME, 
		selectEnum: ExampleSelect
	})
	async charts(
		@Query() query: any,
		@Query('search') search: string,
		@Query('from') from: string,
		@Query('to') to: string,
		@Query('fields') fields: string[],
		@Query('period') period?: ChartsPeriod,
	): Promise<ChartsResponseDto> {
		return await crudCharts<T>({
			service: this.service,
			tQuery: this.tQuery,
			query,
			search,
			period,
			fields,
			...(from && { from: new Date(from) }),
			...(to && { to: new Date(to) }),
			searchFields: SEARCH_FIELDS,
		})
	}
```

### Bulk Upload

::: Danger
Document here
:::

### Bulk Upload Fields

::: Danger
Document here
:::

### Update

Update an object in the database.

```typescript
@UpdateDecorator({entity: E, primaryKey: PRIMARY_KEY, name: NAME})
async update(@Param() params, @Body() data: UpdateExampleDto): Promise<T> {
    return await crudUpdate<T>({
        service: this.service,
		primaryKey: params[PRIMARY_KEY],
        data: data,
	})
}
```

### Delete

Delete an object in the database.

```typescript
@DeleteDecorator({entity: E, primaryKey: PRIMARY_KEY, name: NAME})
async delete(@Param() params): Promise<T> {
    return await crudDelete<T>({
        service: this.service,
		primaryKey: params[PRIMARY_KEY]
	})
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

@ReadOneDecorator({
    entity: E, 
    primaryKey: PRIMARY_KEY, 
    selectEnum: ExampleSelect, 
    relationsEnum: ExampleRelations, 
    name: NAME,
	currency_field: CURRENCY_FIELD,
	currency_fields: CURRENCY_FIELDS
})
async findOne(@Req() req, @AccountId() account_id: number, @Param() params, @Query() query): Promise<T> {
	return await crudFindOne<T>({
		service: this.service,
		query: query,
		primaryKey: params[PRIMARY_KEY],
		currency: {
			fxService: fxService, //injected in the constructor
			currency_field: CURRENCY_FIELD,
			currency_fields: CURRENCY_FIELDS
			//currency is not required as it will be taken from the query param "currency" passed by the client
		}
	})
}
```
