---
title: Component Testing
---

# Component Testing

To test vue-components `vue-test-utils` can be used. It is a set of utility functions aimed to simplify testing Vue.js components. It provides some methods to mount and interact with Vue components in an isolated manner.

Example:

```ts
import { mount } from '@vue/test-utils'
import { it, expect } from 'vitest'

// The component to test
const MessageComponent = {
	template: '<p>{{ msg }}</p>',
	props: ['msg'],
}

it('displays message', () => {
	const wrapper = mount(MessageComponent, {
		props: {
			msg: 'Hello world',
		},
	})

	// Assert the rendered text of the component
	expect(wrapper.text()).toContain('Hello world')
})
```

## Mounting components

To mount a component you can simply call the `mount` function with your component and required props, as shown above.
Sometimes you don't want children components to be rendered as your not testing them. In that case you can call the `shallowMount` function.

## Finding elements

After mounting a component. You have an object of type `VueWrapper`. It provides an API to find children components and nodes:

-   `find`: finds an `HTMLElement` based on a selector (eg. `.className`)
-   `findAll`: finds an `Array` of `HTMLElement` based on a selector (eg. `.className`)
-   `findComponent`: finds a Vue-component based on a selector or a component definition.
-   `findAllComponents`: finds `Array` of Vue-components based on a selector or a component definition.

```ts
import { Component } from 'src/components/Component.vue'
import { AnotherComponent } from 'src/components/Another.vue'

const wrapper = mount(Component)
const htmlElementWrapper: DOMWrapper = wrapper.find('.className')
const htmlElementWrappers: DOMWrapper[] = wrapper.findAll('.className')

const vueWrapper: VueWrapper<AnotherComponent> = wrapper.findComponent(AnotherComponent)
const vueWrappers: VueWrapper<AnotherComponent>[] = wrapper.findAllComponents(AnotherComponent)
```

## Mocking pinia

To mock your stores inside of the components a mocked pinia instance must be provided.
There is helper function which does just that:

```ts
import { mountWithMocks } from './utils/wrapper'

const wrapper = mountWithMocks(MessageComponent, {
	props: {
		msg: 'Hello world',
	},
})
```

This pinia instance will have no functional mocks set up however. To mock a store you need to create your own pinia instance and attach the mocked stores:

```ts
import { mockPinia, mountWithMocks } from './utils/wrapper'
import { RandomStore } from 'src/stores/random'

const pinia = mockPinia()
const store = RandomStore(pinia)
store.number = 4
const wrapper = mountWithMocks(Component, { pinia })
```

## Asynchronous components

Sometimes setup functions use asynchronous elements inside their `setup()` function or if you are using `<script setup>`:

```vue
<script setup>
const number = ref(await store.getNumber())
</script>
```

In this case the component needs to be embedded in `<Suspense>` component.

```vue
<template>
	<Suspense>
		<Component />
	</Suspense>
</template>
```

There is also a helper function, which does just that and provides the parent and the child component:

```ts
import { asyncMountWithMocks } from './utils/wrapper'

const { component, parent } = await asyncMountWithMocks(Component)
```

## Mocking vue-router

Sometimes your component need to access a `vue-router` instance.
There is a helper instance to inject a mocked router:

```ts
import { beforeEach } from 'vitest'
import { createAndInjectRouter } from './utils/wrapper'

beforeEach(() => {
	createAndInjectRouter()
})
```

The router can then be accessed from the component's wrapper:

```ts
beforeEach(() => {
	createAndInjectRouter()
})

it('does something with the router', () => {
	const wrapper = mock(Component)
	const router = wrapper.router
})
```
