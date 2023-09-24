import { DefineComponent } from 'vue'
import { ComponentMountingOptions } from '@vue/test-utils/dist/mount'
import { VueWrapper } from '@vue/test-utils/dist/vueWrapper'
import { mount } from '@vue/test-utils'
import { createRouterMock, injectRouterMock, RouterMock } from 'vue-router-mock'
import { createTestingPinia } from '@pinia/testing'
import { vitest } from 'vitest'

function createAndInjectRouter(wrapper?: VueWrapper) {
	const router = createRouterMock({
		spy: {
			create: fn => vitest.fn(fn),
			reset: spy => spy.mockReset(),
		},
	})
	injectRouterMock(router)

	router.isReady = async () => void vitest.fn()
	if (wrapper) {
		wrapper.router = router
		wrapper.getCurrentComponent()['setupState'].router = router
	}
}

function mountWithMocks<T extends DefineComponent<any, any, any, any, any>>(
	component: T,
	options?: ComponentMountingOptions<T>,
): VueWrapper<InstanceType<T>> {
	let mountOptions = { global: { plugins: [createTestingPinia({ createSpy: vitest.fn })] } }
	if (options) {
		mountOptions = Object.assign(mountOptions, options)
	}

	return mount(component, mountOptions)
}

function getRouter(wrapper: VueWrapper): RouterMock {
	return (
		wrapper.router ||
		wrapper.getCurrentComponent()['setupState']?.router ||
		wrapper.getCurrentComponent().data.router ||
		undefined
	)
}

async function waitForTimeout(func: () => any) {
	await new Promise((resolve, reject) => {
		setTimeout(async () => {
			try {
				await func()
			} catch (e: any) {
				reject(e)
				throw e
			}
			resolve(true)
		}, 0)
	})
}

export { mountWithMocks, waitForTimeout, createAndInjectRouter, getRouter }
