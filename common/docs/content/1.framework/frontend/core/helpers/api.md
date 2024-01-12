# Api

The api helper makes it easy to perform API calls to the backend framework.

## Usage

```ts
import { Api } from '@juicyllama/frontend-core'

const api = new Api<T>()
```

## Methods

### Create

Create a record via the API endpoint.

```ts
import { Api, User } from '@juicyllama/frontend-core'

const api = new Api<User>()
const user = await api.create({
	url: '/users',
	data: {
		name: 'John Doe',
		email: 'john@doe.com',
	},
})

// User {
//     id: 1,
//     name: 'John Doe',
//     email: 'john@doe.com'
//     ...
// }
```
