# Middlewear

## Authentication

### MiddlewareAccountId

This middleware is used to validate the user has access to the account id they are passing via the API.

It is recommended you use this when exposing endpoints.

::alert{type="info"}
As a bonus this will also pass account and user details to logging tools like Bugnsag.
::

You can apply this via your Module as follows

```typescript
import { MiddlewareAccountId } from '@juicyllama/core'

@Module({ 
// imports 
})

export class ExampleModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(MiddlewareAccountId)
	}
}
```