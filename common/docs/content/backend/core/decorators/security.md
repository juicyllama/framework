## Security Decorators

A set of prebuilt decorators to help secure your endpoints.

### Accounts

Users can belong to multiple accounts. This is useful for developing multi-tenant applications.

To understand which account the user is acting on behalf of when making API calls its important they provide the correct account ID in these requests.

They do this by providing the `account-id` header.

Your application should then get this `accountId` from the request and use it to determine which account the user is acting on behalf of.

```typescript
import { AccountId, UserAuth } from '@juicyllama/core'

@Get('example')
@UserAuth() //see below
example(@Req() req, @AccountId() accountId: number): Promise<T> {
    //controller code, for example lookup records by accountId
}
```

This will validate that the header record exists and return that number to the controller.

### Users

Endpoints which require user authentication can be decorated with the `@UserAuth()` decorator.

```typescript
import { UserAuth } from '@juicyllama/core'

@Get('example')
@UserAuth() //see below
example(@Req() req): Promise<T> {
    //controller code
}
```

Under the hood this will validate that the user is logged in and has a valid JWT token.

It will also add some useful Swagger properties to the endpoint, including the requirement for the `account-id` header (see above), along with some common API responses.

Should you wish to have more granular control, you can import the important decorators directly:

```typescript
import { UseGuards } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '@juicyllama/core'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
```
