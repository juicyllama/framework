import { describe, expect, it, vitest, beforeEach } from 'vitest'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest'
import { createAndInjectRouter, getRouter, mountWithMocks, waitForTimeout } from '../../../utils/wrapper'
import { prefillFormByName } from '../../../../test/utils/form'
import Login  from '../../../../src/components/core/auth/Login.vue'
import { userStore } from '../../../../src'
import Actions from '../../../../src/components/core/auth/Actions.vue'
import { DOMWrapper } from '@vue/test-utils'

describe('Login', () => {
	installQuasarPlugin()

	beforeEach(() => {
		createAndInjectRouter()
	})

	it('can toggle password shown and hidden', async () => {
		const wrapper = mountWithMocks(Login, { propsData: { showLabels: true } })
		const toggleWrapper = wrapper.find('.fa-eye-slash')
		await toggleWrapper.trigger('click')

		await waitForTimeout(() => {
			expect(wrapper.find('.fa-eye')).toBeDefined()
		})
	})

	it('routes to /passwordless', async () => {
		const wrapper = mountWithMocks(Login, {
			propsData: { showLabels: true, facebook: true, google: true, linkedin: true },
		})
		await wrapper.vm.$nextTick()
		const actions = await wrapper.findComponent(Actions)
		actions.getCurrentComponent()['setupState'].password = true
		await wrapper.vm.$nextTick()
		let button: DOMWrapper<HTMLButtonElement> | unknown = undefined
		await waitForTimeout(() => {
			button = wrapper.findAll('button').find(button => {
				return button.html().includes('fa-key')
			})
		})
		expect(button).toBeDefined()
		await button.trigger('click')
		await waitForTimeout(() => {
			button = wrapper.findAll('button').find(button => {
				return button.html().includes('fa-key')
			})
		})
		await waitForTimeout(() => {
			expect(getRouter(wrapper).push).toHaveBeenCalledWith('/passwordless')
		})
	})

	it('calls social login functions', async () => {
		// const wrapper = mountWithMocks(Login, {
		// 	propsData: { showLabels: true, facebook: true, google: true, linkedin: true },
		// })
		// await wrapper.vm.$nextTick()
		// const actions = await wrapper.findComponent(Actions)
		// actions.getCurrentComponent()['setupState'].password = true
		// await wrapper.vm.$nextTick()
		// let buttons: DOMWrapper<HTMLButtonElement>[] = []
		// await waitForTimeout(() => {
		// 	buttons = wrapper.findAll('button').filter(button => {
		// 		return button.html().includes('fa-brands')
		// 	})
		// })
		// const googleButton = buttons.find(btn => btn.find('.fa-google'))
		// const facebookButton = buttons.find(btn => btn.find('.fa-facebook'))
		// const linkedInButton = buttons.find(btn => btn.find('.fa-linkedin'))
		//
		// expect(linkedInButton).toBeTruthy()
		// expect(googleButton).toBeTruthy()
		// expect(facebookButton).toBeTruthy()
		//
		// await linkedInButton.trigger('click')
		// await googleButton.trigger('click')
		// await facebookButton.trigger('click')
		//Check expected social login result when implemented
	})

	it('calls login and redirects to dashboard on submit', async () => {
		const wrapper = mountWithMocks(Login, { propsData: { showLabels: true } })

		const formFieldsAndData = {
			"email": "correctEmail@gmail.com",
			"password": "super!SecureP4ssw0rd"
		}
		await prefillFormByName(wrapper, formFieldsAndData)
		const qInputs = wrapper.findAll('.q-field.q-input')
		expect(qInputs.length).toBe(2)

		const form = wrapper.find('form')
		userStore.login = vitest.fn().mockImplementationOnce(() => {
			return {
				user_id: 1,
			}
		})
		await wrapper.vm.$nextTick()
		await form.trigger('submit')

		await waitForTimeout(() => {
			expect(userStore.login).toHaveBeenCalled()
			expect(getRouter(wrapper).push).toHaveBeenCalledWith('/dashboard')
		})
	})

	it('does not call login form is invalid', async () => {
		const wrapper = mountWithMocks(Login)

		const formFieldsAndData = {
			"email": "correctEmail@gmail.com",
			"password": "1234"
		}
		await prefillFormByName(wrapper, formFieldsAndData)
		const qInputs = wrapper.findAll('.q-field.q-input')
		expect(qInputs.length).toBe(2)

		const form = wrapper.find('form')
		userStore.login = vitest.fn().mockImplementationOnce(() => {
			return {
				user_id: 1,
			}
		})

		await wrapper.vm.$nextTick()
		await form.trigger('submit')

		await waitForTimeout(() => {
			expect(qInputs[0].classes()).not.toContain('q-field--error')
			expect(qInputs[1].classes()).toContain('q-field--error')

			expect(userStore.login).not.toHaveBeenCalled()
			expect(getRouter(wrapper).push).not.toHaveBeenCalledWith('/dashboard')
		})
	})

	it('redirects when token is present', async () => {
		window.localStorage.setItem('token', 'mock')
		const wrapper = mountWithMocks(Login)
		expect(getRouter(wrapper).push).toHaveBeenCalledWith('/dashboard')
	})

	it('validates password input', async () => {
		const wrapper = mountWithMocks(Login)
		const formFieldsAndData = {
			"email": "correctEmailgmail.com",
			"password": "1234"
		}
		await prefillFormByName(wrapper, formFieldsAndData)
		const qInputs = wrapper.findAll('.q-field.q-input')

		await waitForTimeout(() => {
			expect(qInputs[0].classes()).toContain('q-field--error')
			expect(qInputs[1].classes()).toContain('q-field--error')
			expect(wrapper.html()).includes('Must be a valid email.')
			expect(wrapper.html()).includes('Password must meet all criteria.')
		})
	})
})
