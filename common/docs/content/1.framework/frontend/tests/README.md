---
title: Getting Started
---

# Getting Started with Testing

## Installing vitest

It is recommended that you install a copy of vitest in your package.json, using one of the methods listed below.
However, if you would prefer to run vitest directly, you can use `npx vitest` (the npx command comes with npm and Node.js).
The npx command will execute the command either from a local `node_modules/.bin` installing any packages needed in order for the command to run.
By default, npx will check whether command exists in `$PATH`, or in the local project binaries, and execute that. If command is not found, it will be installed prior to execution.

### With npm

```bash
pnpm install -D vitest
```

### or with yarn

```bash
yarn add -D vitest
```

### or with pnpm

```bash
pnpm add -D vitest
```

## Configuration

By default `vitest` uses the same `vite.config.ts` as your project.
If you want a different configuration during testing, you can create vitest.config.ts, which will have the higher priority.
To configure `vitest` itself, add `test` property in your Vite config. You'll also need to add a reference to Vitest types using a triple slash command at the top of your config file, if you are importing `defineConfig` from `vite` itself.

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		// ...
	},
})
```

## Writing a test

`vitest` follows the same conventions as `jest`. So if you are familiar with either of them this should be easy for you.

### Basic test

```typescript
import { describe, it, expect } from 'vitest'

function sum(a, b) {
	return a + b
}

describe('math', () => {
	it('can add 2 numbers', () => {
		expect(sum(2, 3)).toEqual(5)
	})
})
```

## Coverage

'vitest' supports Native code coverage via `c8` and instrumented code coverage via `istanbul`.

Both `c8` and `istanbul` support are optional. By default, `c8` will be used.

You can select the coverage tool by setting `test.coverage.provider` to either `c8` or `istanbul`:

```typescript
// vite.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		coverage: {
			provider: 'istanbul', // or 'c8'
		},
	},
})
```

There are also different reporters from which you can choose. Read more: [https://vitest.dev/guide/coverage.html](https://vitest.dev/guide/coverage.html)

## Creating test objects

In some cases you will need to provide mocked data objects to your tests.  
For the `User` and `Account` objects factories are provided:

```typescript
import { UserFactory } from './mocks/factory'
const user = UserFactory.createUser()
```

It is also possible to get the latest created mock object to pass it somewhere else:

```typescript
import { UserFactory } from './mocks/factory'
const user = UserFactory.lastUser()
```

Data that gets passed into these functions will override the mocked data from the factory:

```typescript
import { UserFactory } from './mocks/factory'
const user = UserFactory.createUser({ first_name: 'John' })

console.log(user.first_name) //displays 'John'
```
