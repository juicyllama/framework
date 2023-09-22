import { beforeEach, describe, expect, it, vitest } from 'vitest'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest'
import Reset from '@/components/core/auth/Reset.vue'
import { createAndInjectRouter, getRouter, mountWithMocks, waitForTimeout } from '@/../test/utils/wrapper'
import { UserStore } from '@/store/user'
import { OTP } from '@juicyllama/utils'

describe('Reset', () => {
	beforeEach(() => {
		createAndInjectRouter()
	})

	installQuasarPlugin()

	it('validates email and shows error message', async () => {
		const wrapper = mountWithMocks(Reset)
		const emailInput = wrapper.find('input')
		await emailInput.setValue('incorrectEmailgmail.com')
		await new Promise(resolve =>
			setTimeout(() => {
				expect(wrapper.html()).includes('Must be a valid email.')
				resolve(true)
			}, 0),
		)
	})
	it('validates email and shows no error message', async () => {
		const wrapper = mountWithMocks(Reset)
		const emailInput = wrapper.find('input')
		await emailInput.setValue('correctEmail@gmail.com')
		await new Promise(resolve =>
			setTimeout(() => {
				expect(wrapper.html()).not.includes('Must be a valid email.')
				resolve(true)
			}, 0),
		)
	})
	it('sends reset request and changes to next stage on submit', async () => {
		const wrapper = mountWithMocks(Reset)
		const userStore = UserStore()
		userStore.reset = vitest.fn().mockImplementationOnce(() => true)

		const emailInput = wrapper.find('input')
		const emailValue = 'correctEmail@gmail.com'
		await emailInput.setValue(emailValue)
		const form = wrapper.find('form')
		await form.trigger('submit')
		await waitForTimeout(() => {
			expect(userStore.reset).toHaveBeenCalled()
		})
		expect(wrapper.html()).includes('Verify Account')
	})

	it('calls store for verification of code and changes to next stage on submit', async () => {
		const wrapper = mountWithMocks(Reset)
		const userStore = UserStore()
		userStore.resetCode = vitest.fn().mockImplementationOnce(() => true)

		const currentComponent = wrapper.getCurrentComponent() as any
		currentComponent.setupState.state.stage = 1
		await wrapper.vm.$nextTick()
		const otp = wrapper.findComponent(OTP)
		otp.getCurrentComponent().emit('complete', 'code')
		await waitForTimeout(() => {
			expect(userStore.resetCode).toHaveBeenCalled()
			expect(wrapper.html()).includes('New Password')
		})
	})

	it('calls store for password reset and navigates to dashboard on success', async () => {
		const wrapper = mountWithMocks(Reset)
		const userStore = UserStore()
		userStore.resetComplete = vitest.fn().mockImplementationOnce(async () => {
			return { user_id: '1' }
		})

		const currentComponent = wrapper.getCurrentComponent() as any
		currentComponent.setupState.state.stage = 2
		await waitForTimeout(() => {
			expect(wrapper.html()).includes('New Password')
		})

		const passwordInput = wrapper.findAll('input')
		await passwordInput[0].setValue('!newSecurePassword!1')
		await passwordInput[1].setValue('!newSecurePassword!1')
		await waitForTimeout(() => expect(wrapper.html()).not.includes('Must be at least 12 characters long.'))
		const form = wrapper.find('form')
		await form.trigger('submit')
		await waitForTimeout(async () => {
			expect(userStore.resetComplete).toHaveBeenCalled()
			expect(getRouter(wrapper).push).toHaveBeenCalledWith('/dashboard')
		})
	})
})
