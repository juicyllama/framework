# Testing

The framework provides a number of helpers for testing.

## Backend

In your backend applications you can reduce a lot of complexity by using the scaffolding and helpers provided.

### Scaffolding

The scaffolding is provided via the `@juicyllama/core` package and provides everything you need to perform tests quickly and effectively.

::alert{type="info"}
Pass into the scaffolding the NestJs Module and Service you wish to test. This will build the test suite with all the imports required and a bunch of pre-build services to leverage including the one you pass in.
::

```typescript
//example.test.spec.ts

describe(`Example Test Suite`, () => {
	const scaffolding = new Scaffold<T>()
	let scaffold: ScaffoldDto<T>

	beforeAll(async () => {
		scaffold = await scaffolding.up(MODULE, SERVICE)
	})

	// tests here

	afterAll(async () => {
		await scaffolding.down(E)
	})
})
```

You can then use the `scaffold` object to access the following (use the ScaffoldDto type to get intellisense):

| Property   | Description                                                     |
| ---------- | --------------------------------------------------------------- |
| server     | The NestJs HttpServer server instance                           |
| module     | The TestingModule instance                                      |
| query      | The typeorm query helper                                        |
| repository | The typeorm repository for the entity                           |
| services   | A number of pre-imported services and the service you passed in |
| values     | A number of pre-imported values you can use in your tests       |

### Controllers

A `TestEndpoint` helper is provided to make testing CRUD endpoints easier.

```typescript
await TestEndpoint<T>({
	type: METHOD.GET,
	scaffold: scaffold,
	url: `${url}/${primaryKey}`,
	PRIMARY_KEY: PRIMARY_KEY,
})
```

The following properties are available:

| Property            | Description                                                                                          |
| ------------------- | ---------------------------------------------------------------------------------------------------- |
| type                | The HTTP METHOD to use                                                                               |
| scaffold            | The scaffold object                                                                                  |
| url                 | The URL to call                                                                                      |
| data                | The data to pass to the endpoint in the body                                                         |
| query               | An object with any query params you wish to pass                                                     |
| PRIMARY_KEY         | The name of the primary key for the entity                                                           |
| primaryKey          | The value of the primary key for the entity                                                          |
| access_token        | If you wish to use a different user to the owner of the testing account                              |
| account             | If you wish to pass make the request for different account from the account setup in the scaffolding |
| emitCheckResultKeys | An array of keys to skip validating in the response                                                  |

### Services

A `TestService` helper is provided to make testing your services easier.

```typescript
await TestService<T>({
	type: METHOD.GET,
	scaffold: scaffold,
	PRIMARY_KEY: PRIMARY_KEY,
})
```

The following properties are available:

| Property    | Description                                           |
| ----------- | ----------------------------------------------------- |
| type        | The METHOD to use                                     |
| scaffold    | The scaffold object                                   |
| mock        | The data to pass to the endpoint in the body          |
| PRIMARY_KEY | The name of the primary key for the entity            |
| record      | An existing record to compare the resulting action to |

## Frontend

::alert{type="danger"}
We need to build a similar scaffolding for the frontend.
::
