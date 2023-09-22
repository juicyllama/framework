import { it, describe, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import OTP from '@/components/core/auth/OTP.vue'

describe('OTP', () => {
	const wrapper = mount(OTP)
	it('renders six input fields', () => {
		expect(wrapper.findAll('.otp-input').length).toBe(6)
	})
	it('emits complete when filled', async () => {
		for (const field of wrapper.findAll('.otp-input')) {
			const index = wrapper.findAll('.otp-input').indexOf(field)
			await field.setValue(index + '')
		}
		expect(wrapper.emitted('complete')).toBeTruthy()
	})
})
