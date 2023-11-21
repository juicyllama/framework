## Swagger Decorators

A prebuilt swagger decorator to make creating your swagger documentation is simple as possible.

### Decorator

```typescript
import { SwaggerPropertyDecorator } from '@juicyllama/core'

@SwaggerPropertyDecorator(options)
```

### Options

Provide the following optional options to the decorator:

| Option      | Type                                                  | Description                                          |
| ----------- | ----------------------------------------------------- | ---------------------------------------------------- |
| type        | [SwaggerPropertyType](#swaggerPropertyType)           | The type of the property                             |
| required    | boolean                                               | Is the property required                             |
| hidden      | boolean                                               | Should the property be hidden from the documentation |
| description | string                                                | The description of the property                      |
| example     | string \| number \| boolean \| Date \| object         | An example of the property                           |
| enum        | any                                                   | An enum of the property                              |
| ref         | [SwaggerPropertyReference](#swaggerPropertyReference) | The reference to a type                              |

#### SwaggerPropertyType

Import the enum from the core package and reference it in your decorator.

```typescript
import { SwaggerPropertyType } from '@juicyllama/core'

enum SwaggerPropertyType {
	STRING,
	NUMBER,
	BOOLEAN,
	DATE,
	ARRAY,
	OBJECT,
	ENUM,
	EMAIL,
}
```

#### SwaggerPropertyReference

If you would like to reference other common resources in your documentation, you can use the following enum.

```typescript
import { SwaggerPropertyReference } from '@juicyllama/core'

export enum SwaggerPropertyReference {
	ACCOUNT = 'ACCOUNT',
	ACCOUNTS = 'ACCOUNTS',
	CONTACTS = 'CONTACTS',
	USER = 'USER',
	USERS = 'USERS',
}
```

### Output

Depending on the inputs you provide, the decorator will build the swagger documentation for you.

For example, if you provide the following:

```typescript
import { SwaggerPropertyDecorator, SwaggerPropertyType } from '@juicyllama/core'

@SwaggerPropertyDecorator({
    type: SwaggerPropertyType.NUMBER,
    description: 'The unique identifier for this record',
    example: 1,
})
```

The output in your endpoints will be a documented property of type number, with the description and example shown above.
