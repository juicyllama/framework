# BaseEntity

You can extend your services with this class to add the common CRUD methods.

## Usage

```ts
import { BaseService, BeaconService, Query } from '@juicyllama/core'

const E = Example
type T = Example

@Injectable()
export class ExampleService extends BaseService<T> {
	constructor(
		@Inject(forwardRef(() => Query)) readonly query: Query<T>,
		@InjectRepository(E) readonly repository: Repository<T>,
		@Inject(forwardRef(() => BeaconService)) readonly beaconService: BeaconService, //optional
		@Inject(CACHE_MANAGER) readonly cacheManager: Cache, //optional
	) {
		super(query, repository, {
			beacon: beaconService,
			cache: {
				cacheManager: cacheManager,
				field: 'name', //unique field to use for caching (use the most common lookup)
				ttl: CachePeriod.MONTH,
			},
		})
	}
}
```

## Methods

The following methods are automatically available to your service.

### Create

Creates a record in the database and returns the result. If the cache is enabled, it will also add the record to the cache. If the beacon is enabled, it will also send a push message to your frontend application.

```ts
import { ExampleService } from './example.service'

@Injectable()
export class ExampleClass {
	constructor(@Inject(forwardRef(() => ExampleService)) private readonly exampleService: ExampleService) {}

	async create(): Promise<Example> {
		return await this.exampleService.create({
			name: 'Example',
		})
	}
}
```

### FindAll

Returns all records from the database.

::alert{type="info"}
This method skips the cache and returns results directly from the database.
::

```ts
import { ExampleService } from './example.service'

@Injectable()
export class ExampleClass {
	constructor(@Inject(forwardRef(() => ExampleService)) private readonly exampleService: ExampleService) {}

	async findAll(): Promise<Example[]> {
		return await this.exampleService.findAll({
			where: {
				name: 'Example',
				age: 30,
			},
		})
	}
}
```

### FindOne

Returns one record from the cache, if not found in the cache it will return from the database. If the cache is enabled, it will also add the record to the cache.

```ts
import { ExampleService } from './example.service'

@Injectable()
export class ExampleClass {
	constructor(@Inject(forwardRef(() => ExampleService)) private readonly exampleService: ExampleService) {}

	async findOne(): Promise<Example> {
		return await this.exampleService.findOne({
			where: {
				name: 'Example',
			},
		})
	}
}
```

### FindById

Does the same as [findById](#findById) but lets you pass in the `Id` of the record.

```ts
import { ExampleService } from './example.service'

@Injectable()
export class ExampleClass {
	constructor(@Inject(forwardRef(() => ExampleService)) private readonly exampleService: ExampleService) {}

	async findById(): Promise<Example> {
		return await this.exampleService.findById(1)
	}
}
```

### Count

Returns the number of records in the database based on the [FindManyOptions](https://typeorm.delightful.studio/interfaces/_find_options_findmanyoptions_.findmanyoptions.html) provided.

```ts
import { ExampleService } from './example.service'

@Injectable()
export class ExampleClass {
	constructor(@Inject(forwardRef(() => ExampleService)) private readonly exampleService: ExampleService) {}

	async count(): Promise<StatsResponseDto> {
		return await this.exampleService.count({
			where: {
				name: 'Example',
			},
		})
		// { count: 1 }
	}
}
```

### Sum

Returns the sum value of the field provided in the database and using the [FindManyOptions](https://typeorm.delightful.studio/interfaces/_find_options_findmanyoptions_.findmanyoptions.html) provided.

```ts
import { ExampleService } from './example.service'

@Injectable()
export class ExampleClass {
	constructor(@Inject(forwardRef(() => ExampleService)) private readonly exampleService: ExampleService) {}

	async sum(): Promise<StatsResponseDto> {
		return await this.exampleService.sum('age', {
			where: {
				name: 'Example',
			},
		})
		// { sum: 30 }
	}
}
```

### Avg

Returns the average value of the field provided in the database and using the [FindManyOptions](https://typeorm.delightful.studio/interfaces/_find_options_findmanyoptions_.findmanyoptions.html) provided.

```ts
import { ExampleService } from './example.service'

@Injectable()
export class ExampleClass {
	constructor(@Inject(forwardRef(() => ExampleService)) private readonly exampleService: ExampleService) {}

	async avg(): Promise<StatsResponseDto> {
		return await this.exampleService.avg('age', {
			where: {
				name: 'Example',
			},
		})
		// { avg: 30 }
	}
}
```

### Charts

Returns a pie/line chart dataset from database, grouped by `field` and using the `ChartOptions` provided.

```ts
import { ExampleService } from './example.service'

@Injectable()
export class ExampleClass {
	constructor(@Inject(forwardRef(() => ExampleService)) private readonly exampleService: ExampleService) {}

	async chart(): Promise<StatsResponseDto> {
		return await this.exampleService.chart('age', {
			where: {
				name: 'Example',
			},
			period: ChartsPeriod.MONTH, // optional
		})
		// [ { count: '1', age: 30, time_interval: '2022-02-01 }, { count: '2', age: 30, time_interval: '2022-03-01 } ]
	}
}
```

### Update

Updates a record in the database and returns the result. If the cache is enabled, it will also update the record in the cache. If the beacon is enabled, it will also send a push message to your frontend application.

```ts
import { ExampleService } from './example.service'

@Injectable()
export class ExampleClass {
	constructor(@Inject(forwardRef(() => ExampleService)) private readonly exampleService: ExampleService) {}

	async update(): Promise<Example> {
		return await this.exampleService.update({
			name: 'New Example',
		})
	}
}
```

### Remove

Performs a soft delete. If the cache is enabled, it will also remove the record from the cache. If the beacon is enabled, it will also send a push message to your frontend application.

```ts
import { ExampleService } from './example.service'

@Injectable()
export class ExampleClass {
	constructor(@Inject(forwardRef(() => ExampleService)) private readonly exampleService: ExampleService) {}

	async remove(example: Example): Promise<Example> {
		return await this.exampleService.remove(example)
	}
}
```

### Purge

Performs a hard delete (removes the record from the database). If the cache is enabled, it will also remove the record from the cache. If the beacon is enabled, it will also send a push message to your frontend application.

```ts
import { ExampleService } from './example.service'

@Injectable()
export class ExampleClass {
	constructor(@Inject(forwardRef(() => ExampleService)) private readonly exampleService: ExampleService) {}

	async purge(example: Example): Promise<void> {
		await this.exampleService.purge(example)
	}
}
```

### Raw

Allows you to perform raw SQL query on the database.

```ts
import { ExampleService } from './example.service'

@Injectable()
export class ExampleClass {
	constructor(@Inject(forwardRef(() => ExampleService)) private readonly exampleService: ExampleService) {}

	async raw(): Promise<any> {
		return await this.exampleService.raw('SELECT * FROM example WHERE name = "Example"')
	}
}
```
