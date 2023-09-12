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
} from '@juicyllama/core'
```

## Methods

The following methods can be used in your application:

### Create

Create a new object in the database.

```typescript
@CreateDecorator(T, NAME)
async create(@Body() data: CreateExampleDto): Promise<T> {
    return await crudFindAll<T>({
        service: this.exampleService,
        data: data,
	})
}
```

### FindAll

Find all objects in the database.

```typescript
@ReadManyDecorator(E, ExampleSelect, ExampleOrderBy, ExampleRelations, NAME)
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
@ReadOneDecorator(E, PRIMARY_KEY, ExampleSelect, ExampleRelations, NAME)
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
@ReadStatsDecorator(NAME)
async stats(
	@Req() req,
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
@ReadChartsDecorator(NAME)
async charts(
	@Req() req,
    @AccountId() account_id: number,
    @Query('search') search: string,
    @Query('from') from: string,
        @Query('to') to: string,
    @Query('fields') fields: string[],
    @Query('period') period?: ChartsPeriod,
): Promise<ChartsResponseDto> {
	return await crudCharts<T>({
		service: this.service,
		tQuery: this.tQuery,
		account_id: account_id,
		search,
		period,
		fields,
		...(from && { from: new Date(from) }),
		...(to && { to: new Date(to) }),
		searchFields: SEARCH_FIELDS,
	})
}
```

### Update

Update an object in the database.

```typescript
@CreateDecorator(T, NAME)
async update(@Param() params, @Body() data: UpdateExampleDto): Promise<T> {
    return await crudUpdate<T>({
        service: this.exampleService,
		primaryKey: params[PRIMARY_KEY],
        data: data,
	})
}
```

### Delete

Delete an object in the database.

```typescript
@CreateDecorator(T, NAME)
async delete(@Param() params): Promise<T> {
    return await crudDelete<T>({
        service: this.exampleService,
		primaryKey: params[PRIMARY_KEY]
	})
}
```

