import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import OTP from '../../../../src/components/core/auth/OTP.vue'

describe('OTP', () => {
	const wrapper = mount(OTP)
	it('renders six input fields', () => {
		expect(wrapper.findAll('[input-classes=otp-input]').length).toBe(6)
	})
	// FIXME the OTP doesn't render regular fields now, thus the test cannot use setValue to fill the fields. Need to find a way to do it.
	it.skip('emits complete when filled', async () => {
		for (const field of wrapper.findAll('[input-classes=otp-input]')) {
			const index = wrapper.findAll('[input-classes=otp-input]').indexOf(field)
			await field.setValue(index + '')
		}
		expect(wrapper.emitted('complete')).toBeTruthy()
	})
})
