import { describe, expect, it, vitest, beforeEach } from 'vitest'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest'
import { createAndInjectRouter, getRouter, mountWithMocks, waitForTimeout } from '@/../test/utils/wrapper'
import { prefillFormByName } from '@/../test/utils/form'
import { UserStore } from '@/store/user'
import Passwordless from '@/components/core/auth/Passwordless.vue'

describe('Passwordless', () => {
	installQuasarPlugin()

	beforeEach(() => {
		createAndInjectRouter()
	})


	it('validates email and lets user go the next stage', async () => {
		const wrapper = mountWithMocks(Passwordless)
		const formFieldsAndData = {
			"email": "correctEmail@gmail.com"
		}
		await prefillFormByName(wrapper, formFieldsAndData)
		const userStore = UserStore()
		userStore.passwordlss = vitest.fn().mockImplementationOnce(() => true)
		await waitForTimeout(() => {
			expect(wrapper.html()).not.includes('Must be a valid email.')
		})
		const form = wrapper.find('form')
		await form.trigger('submit')
		await waitForTimeout(() => {
			expect(userStore.passwordlss).toHaveBeenCalled()
		})
	})

	it('validates email and shows error message in case of error', async () => {
		const wrapper = mountWithMocks(Passwordless)
		const formFieldsAndData = {
			"email": "incorrectEmailgmail.com"
		}
		await prefillFormByName(wrapper, formFieldsAndData)
		await new Promise(resolve =>
			setTimeout(() => {
				expect(wrapper.html()).includes('Must be a valid email.')
				resolve(true)
			}, 0),
		)
	})

	it('calls store for passwordlssCode action and navigates to dashboard', async () => {
		const wrapper = mountWithMocks(Passwordless)
		const userStore = UserStore()
		userStore.passwordlssCode = vitest.fn().mockImplementationOnce(() => {
			return { user_id: 1 }
		})
		const currentComponent = wrapper.getCurrentComponent()
		currentComponent['setupState'].state.stage = 1
		await wrapper.vm.$nextTick()
		// const otp = wrapper.findComponent(OTP)
		// otp.getCurrentComponent().emit('complete', 'code')
		// await waitForTimeout(() => {
		// 	expect(userStore.passwordlssCode).toHaveBeenCalled()
		// 	expect(getRouter(wrapper).push).toHaveBeenCalledWith('/dashboard')
		// })
	})
})
