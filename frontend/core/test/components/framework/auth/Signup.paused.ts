import { describe, expect, it, vitest, beforeEach, test } from 'vitest'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest'
import { createAndInjectRouter, getRouter, mountWithMocks, waitForTimeout } from '../../../utils/wrapper'
import { prefillFormByName } from '../../../utils/form'
import Signup from '../../../../src/components/core/auth/Signup.vue'
import { AccountStore } from '../../../../src/store/account'

describe('Signup', () => {
	installQuasarPlugin()

	beforeEach(() => {
		createAndInjectRouter()
	})

	it('calls create account and redirects to dashboard on submit', async () => {
		const wrapper = mountWithMocks(Signup)
		const accountStore = AccountStore()
		accountStore.create = vitest.fn().mockImplementationOnce(async () => {
			return { user_id: '1' }
		})

		const form = wrapper.find('form')

		const formFieldsAndData = {
			"account-name": "AccountName",
			"given-name": "FirstName",
			"family-name": "LastName",
			"email": "firstname.lastname@gmail.com",
			"password": "super!SecureP4ssw0rd",
			"confirm-password": "super!SecureP4ssw0rd"
		}
		prefillFormByName(wrapper, formFieldsAndData)

		await waitForTimeout(async () => await form.trigger('submit'))
		await waitForTimeout(() => {
			expect(accountStore.create).toHaveBeenCalledOnce()
			expect(getRouter(wrapper).push).toHaveBeenCalledWith('/dashboard')
		})
	})

	it('does not create account when missing required field "Last Name"', async () => {
		const wrapper = mountWithMocks(Signup)
		const accountStore = AccountStore()

		const formFieldsAndData = {
			"account-name": "AccountName",
			"given-name": "FirstName",
			"family-name": "", // This is now invalid
			"email": "firstname.lastname@gmail.com",
			"password": "super!SecureP4ssw0rd",
			"confirm-password": "super!SecureP4ssw0rd"
		}
		prefillFormByName(wrapper, formFieldsAndData)

		const form = wrapper.find('form')
		const qInputs = wrapper.findAll('.q-field.q-input')
		expect(qInputs.length).toBe(6)

		await waitForTimeout(async () => await form.trigger('submit'))
		await waitForTimeout(() => {
			expect(qInputs[1].classes()).not.toContain('q-field--error')
			expect(qInputs[2].classes()).toContain('q-field--error')
			expect(qInputs[3].classes()).not.toContain('q-field--error')

			expect(accountStore.create).not.toHaveBeenCalled()
			expect(getRouter(wrapper).push).not.toHaveBeenCalledWith('/dashboard')
		})
	})

	it('does not create account when missing required field "Email"', async () => {
		const wrapper = mountWithMocks(Signup)
		const accountStore = AccountStore()

		const formFieldsAndData = {
			"account-name": "AccountName",
			"given-name": "FirstName",
			"family-name": "LastName",
			"email": "", // This is now invalid
			"password": "super!SecureP4ssw0rd",
			"confirm-password": "super!SecureP4ssw0rd"
		}
		prefillFormByName(wrapper, formFieldsAndData)

		const form = wrapper.find('form')
		const qInputs = wrapper.findAll('.q-field.q-input')
		expect(qInputs.length).toBe(6)

		await waitForTimeout(async () => await form.trigger('submit'))
		await waitForTimeout(() => {
			expect(qInputs[1].classes()).not.toContain('q-field--error')
			expect(qInputs[2].classes()).not.toContain('q-field--error')
			expect(qInputs[3].classes()).toContain('q-field--error')

			expect(accountStore.create).not.toHaveBeenCalled()
			expect(getRouter(wrapper).push).not.toHaveBeenCalledWith('/dashboard')
		})
	})

	it('does not create account when passwords not match', async () => {
		const wrapper = mountWithMocks(Signup)
		const accountStore = AccountStore()

		const formFieldsAndData = {
			"account-name": "AccountName",
			"given-name": "FirstName",
			"family-name": "LastName",
			"email": "firstname.lastname@gmail.com",
			// This is now invalid
			"password": "super",
			"confirm-password": "SecureP4ssw0rd"
		}
		prefillFormByName(wrapper, formFieldsAndData)

		const form = wrapper.find('form')
		const qInputs = wrapper.findAll('.q-field.q-input')
		expect(qInputs.length).toBe(6)

		await waitForTimeout(async () => await form.trigger('submit'))
		await waitForTimeout(() => {
			expect(qInputs[4].classes()).toContain('q-field--error')

			expect(accountStore.create).not.toHaveBeenCalled()
			expect(getRouter(wrapper).push).not.toHaveBeenCalledWith('/dashboard')
		})
	})

	test.todo('unimplemented test')
})
